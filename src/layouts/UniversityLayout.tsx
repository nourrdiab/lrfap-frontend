import { useAuth } from '../hooks/useAuth';
import { ScaffoldShell } from './ScaffoldShell';

export function UniversityLayout() {
  const { logout, user } = useAuth();
  return (
    <ScaffoldShell
      label="university"
      items={[
        { to: '/university', label: 'Dashboard', end: true },
        { to: '/university/programs', label: 'Applications Review' },
        { to: '/university/ranking', label: 'Ranking' },
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
