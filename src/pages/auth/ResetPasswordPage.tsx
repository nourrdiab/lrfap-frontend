import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function ResetPasswordPage() {
  useDocumentTitle('Reset password');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#0B2545]">Reset password</h1>
      <p className="text-sm text-slate-500">
        Password reset stub — implementation pending Figma frame.
      </p>
    </div>
  );
}
