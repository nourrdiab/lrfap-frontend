import { useAuth } from '../hooks/useAuth';
import { ScaffoldShell } from './ScaffoldShell';

export function ApplicantLayout() {
  const { logout, user } = useAuth();
  return (
    <ScaffoldShell
      label="applicant"
      items={[
        { to: '/applicant', label: 'Dashboard', end: true },
        { to: '/applicant/profile', label: 'Profile & Documents' },
        { to: '/applicant/applications', label: 'My Applications' },
        { to: '/applicant/notifications', label: 'Notifications' },
      ]}
      right={
        <div className="flex items-center gap-3">
          {user?.email ? (
            <span className="hidden text-xs text-white/70 sm:inline">{user.email}</span>
          ) : null}
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Sign out
          </button>
        </div>
      }
    />
  );
}
