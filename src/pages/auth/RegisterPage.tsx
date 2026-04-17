import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function RegisterPage() {
  useDocumentTitle('Create account');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#0B2545]">Create account</h1>
      <p className="text-sm text-slate-500">
        Registration stub — implementation pending Figma frame.
      </p>
    </div>
  );
}
