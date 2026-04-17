import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ScaffoldShell } from './ScaffoldShell';

export function PublicLayout() {
  const { isAuthenticated, user } = useAuth();
  const portalHref =
    user?.role === 'applicant'
      ? '/applicant'
      : user?.role === 'university'
        ? '/university'
        : user?.role === 'lgc'
          ? '/lgc'
          : '/login';

  return (
    <ScaffoldShell
      label="public"
      items={[
        { to: '/', label: 'Home', end: true },
        { to: '/programs', label: 'Programs' },
        { to: '/about', label: 'About' },
      ]}
      right={
        isAuthenticated ? (
          <Link
            to={portalHref}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[#0B2545] transition hover:bg-white/90"
          >
            Open portal
          </Link>
        ) : (
          <Link
            to="/login"
            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[#0B2545] transition hover:bg-white/90"
          >
            Sign in
          </Link>
        )
      }
    />
  );
}
