import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Sign in');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#0B2545]">Sign in</h1>
      <p className="text-sm text-slate-500">
        Auth module stub — implementation pending Figma frame.
      </p>
    </div>
  );
}
