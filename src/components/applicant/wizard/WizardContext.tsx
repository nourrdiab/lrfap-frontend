import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { applicantProfileApi } from '../../../api/applicantProfile';
import { universitiesApi } from '../../../api/universities';
import type { ApplicantProfile, University } from '../../../types';
import { STEPS, isStepSlug, type StepSlug, type StepStatus } from './types';

/**
 * Wizard-wide state and actions. Step components read cached data
 * (profile, universities, selections) and dispatch mutations through
 * this context.
 *
 * On mount, the provider kicks off parallel fetches of the data every
 * step depends on, so steps can read from the cache synchronously:
 *   - GET /api/applicant-profile/me     (Profile + Review steps)
 *   - GET /api/universities             (Profile medical-school dropdown +
 *                                        Programs filter dropdown)
 *
 * When we build the remaining steps we'll add:
 *   - GET /api/applications/:id
 *   - GET /api/documents
 *   - GET /api/programs?cycle=X
 *   - GET /api/specialties
 *
 * Save registration: each step's save handler is registered via
 * registerStepSave. goNext / goPrevious / saveDraft from the shell call
 * the registered fn before navigating, so the shell stays agnostic of
 * step shape. A ref holds the handler so re-registering on every form
 * edit is cheap (no re-render).
 */

type FetchStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface SelectedProgram {
  id: string;
  name: string;
  university: string;
  rank: number;
}

interface ProfileSummary {
  fullName: string;
  applicantId: string;
  dob: string;
  institution: string;
}

export interface WizardContextValue {
  // Routing / identity
  draftId: string;
  currentStep: StepSlug;

  // Chrome data
  stepStatus: Record<StepSlug, StepStatus>;
  completionPercentage: number;
  profileSummary: ProfileSummary;
  welcomeName: string;
  applicationCycle: string;
  applicationDeadline: string;
  preferenceStatus: string;
  selectedPrograms: SelectedProgram[];

  // Cached bootstrap data
  profile: ApplicantProfile | null;
  profileStatus: FetchStatus;
  refetchProfile: () => Promise<void>;
  updateProfileCache: (next: ApplicantProfile) => void;
  universities: University[];
  universitiesStatus: FetchStatus;

  // Save coordination
  isSaving: boolean;
  lastSavedAt: number | null;
  notifySaved: () => void;
  registerStepSave: (fn: (() => Promise<void>) | null) => void;
  saveDraft: () => Promise<void>;

  // Navigation
  goToStep: (step: StepSlug) => void;
  goNext: () => Promise<void>;
  goPrevious: () => Promise<void>;

  // Summary modal
  allProgramsModalOpen: boolean;
  openAllProgramsModal: () => void;
  closeAllProgramsModal: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
const WizardContext = createContext<WizardContextValue | null>(null);

interface WizardProviderProps {
  children: ReactNode;
}

// Mock selections — seven Lebanese programs so the "7 Programs Selected"
// count in the summary row matches Figma. Replace with
// application.selections once the Programs step ships.
const MOCK_SELECTED_PROGRAMS: SelectedProgram[] = [
  { id: '1', name: 'Internal Medicine Residency', university: 'American University of Beirut', rank: 1 },
  { id: '2', name: 'Emergency Medicine Residency', university: 'Lebanese American University', rank: 2 },
  { id: '3', name: 'Pediatrics Residency', university: 'Saint Joseph University', rank: 3 },
  { id: '4', name: 'Cardiology Fellowship', university: 'University of Balamand', rank: 4 },
  { id: '5', name: 'Neurology Residency', university: 'Beirut Arab University', rank: 5 },
  { id: '6', name: 'General Surgery Residency', university: 'American University of Beirut', rank: 6 },
  { id: '7', name: 'Radiology Fellowship', university: 'Lebanese American University', rank: 7 },
];

// TODO [wizard: step derivation]
// Replace this mock with derive-from-state logic once step content ships.
// Per project_wizard_api memory, the rules are:
//   profile    complete when required ApplicantProfile fields are filled
//   documents  complete when every required doc type has an uploaded /
//              verified record (driven by backend's required-docs list,
//              not a frontend-hardcoded set)
//   programs   complete when selections.length >= 1 (no minRequired const
//              exists in the backend)
//   ranking    complete when every selection has a rank AND ranks are
//              consecutive 1..N
//   review     complete when application.status === 'submitted'
// A step is `inProgress` when it has partial data, otherwise `pending`.
// The hard-coded values below match Dashboard 2's Figma state so the mock
// shell renders visibly — remove them when the derivation lands.
const MOCK_STEP_STATUS: Record<StepSlug, StepStatus> = {
  profile: 'complete',
  documents: 'complete',
  programs: 'inProgress',
  'preference-ranking': 'pending',
  review: 'pending',
};

function deriveCurrentStep(pathname: string): StepSlug {
  const match = pathname.match(/\/edit\/([^/?#]+)/);
  const slug = match?.[1];
  return isStepSlug(slug) ? slug : 'profile';
}

export function WizardProvider({ children }: WizardProviderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const draftId = params.id ?? 'draft';

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [allProgramsModalOpen, setAllProgramsModalOpen] = useState(false);

  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [profileStatus, setProfileStatus] = useState<FetchStatus>('idle');
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitiesStatus, setUniversitiesStatus] = useState<FetchStatus>('idle');

  const stepSaveRef = useRef<(() => Promise<void>) | null>(null);

  const currentStep = deriveCurrentStep(location.pathname);

  // Parallel bootstrap fetches — only once per wizard mount.
  useEffect(() => {
    let cancelled = false;
    setProfileStatus('loading');
    applicantProfileApi
      .getMe()
      .then((res) => {
        if (cancelled) return;
        setProfile(res);
        setProfileStatus('loaded');
      })
      .catch(() => {
        if (!cancelled) setProfileStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setUniversitiesStatus('loading');
    universitiesApi
      .list()
      .then((res) => {
        if (cancelled) return;
        setUniversities(res);
        setUniversitiesStatus('loaded');
      })
      .catch(() => {
        if (!cancelled) setUniversitiesStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refetchProfile = useCallback(async () => {
    setProfileStatus('loading');
    try {
      const res = await applicantProfileApi.getMe();
      setProfile(res);
      setProfileStatus('loaded');
    } catch {
      setProfileStatus('error');
    }
  }, []);

  const updateProfileCache = useCallback((next: ApplicantProfile) => {
    setProfile(next);
    setProfileStatus('loaded');
  }, []);

  const registerStepSave = useCallback((fn: (() => Promise<void>) | null) => {
    stepSaveRef.current = fn;
  }, []);

  const notifySaved = useCallback(() => {
    setLastSavedAt(Date.now());
  }, []);

  const runStepSave = useCallback(async (): Promise<boolean> => {
    const fn = stepSaveRef.current;
    if (!fn) return true;
    setIsSaving(true);
    try {
      await fn();
      return true;
    } catch {
      // The step is expected to have surfaced its own error UI. We just
      // need to block navigation.
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const saveDraft = useCallback(async () => {
    await runStepSave();
  }, [runStepSave]);

  const goToStep = useCallback(
    (step: StepSlug) => {
      navigate(`/applicant/applications/${draftId}/edit/${step}`);
    },
    [draftId, navigate],
  );

  const goNext = useCallback(async () => {
    const idx = STEPS.findIndex((s) => s.slug === currentStep);
    if (idx >= STEPS.length - 1) return;
    const ok = await runStepSave();
    if (!ok) return;
    navigate(`/applicant/applications/${draftId}/edit/${STEPS[idx + 1].slug}`);
  }, [currentStep, draftId, navigate, runStepSave]);

  const goPrevious = useCallback(async () => {
    const idx = STEPS.findIndex((s) => s.slug === currentStep);
    if (idx <= 0) return;
    const ok = await runStepSave();
    if (!ok) return;
    navigate(`/applicant/applications/${draftId}/edit/${STEPS[idx - 1].slug}`);
  }, [currentStep, draftId, navigate, runStepSave]);

  const openAllProgramsModal = useCallback(() => setAllProgramsModalOpen(true), []);
  const closeAllProgramsModal = useCallback(() => setAllProgramsModalOpen(false), []);

  const welcomeName = user?.firstName?.trim() || 'there';

  const value = useMemo<WizardContextValue>(
    () => ({
      draftId,
      currentStep,
      stepStatus: MOCK_STEP_STATUS,
      // TODO [wizard: progress %]
      // Replace hard-coded 72 with
      //   Math.round(
      //     (Object.values(stepStatus).filter(s => s === 'complete').length / STEPS.length) * 100
      //   )
      // once stepStatus derives from real data. For now the mock value
      // matches Figma so the hero progress bar has something to render.
      completionPercentage: 72,
      profileSummary: {
        fullName:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : (user?.email ?? 'Applicant'),
        applicantId: profile?._id ?? '—',
        dob: profile?.dateOfBirth
          ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB')
          : '—',
        institution: (() => {
          if (!profile) return '—';
          if (profile.medicalSchool) {
            const u = universities.find((x) => x._id === profile.medicalSchool);
            if (u) return u.shortName ?? u.name;
          }
          if (profile.medicalSchoolOther) return profile.medicalSchoolOther;
          return '—';
        })(),
      },
      welcomeName,
      applicationCycle: '2026',
      applicationDeadline: 'April 20, 2026',
      preferenceStatus: 'Ranking Not Finalized',
      selectedPrograms: MOCK_SELECTED_PROGRAMS,
      profile,
      profileStatus,
      refetchProfile,
      updateProfileCache,
      universities,
      universitiesStatus,
      isSaving,
      lastSavedAt,
      notifySaved,
      registerStepSave,
      saveDraft,
      goToStep,
      goNext,
      goPrevious,
      allProgramsModalOpen,
      openAllProgramsModal,
      closeAllProgramsModal,
    }),
    [
      draftId,
      currentStep,
      user,
      welcomeName,
      profile,
      profileStatus,
      refetchProfile,
      updateProfileCache,
      universities,
      universitiesStatus,
      isSaving,
      lastSavedAt,
      notifySaved,
      registerStepSave,
      saveDraft,
      goToStep,
      goNext,
      goPrevious,
      allProgramsModalOpen,
      openAllProgramsModal,
      closeAllProgramsModal,
    ],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside <WizardProvider>');
  return ctx;
}
