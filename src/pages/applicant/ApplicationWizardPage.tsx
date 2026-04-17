import { Outlet } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { WizardProvider } from '../../components/applicant/wizard/WizardContext';
import { ApplicationWizardShell } from '../../components/applicant/wizard/ApplicationWizardShell';

/**
 * Parent route for /applicant/applications/:id/edit(/:step).
 *
 * Provides WizardContext to every child step, renders the chrome, and
 * leaves an <Outlet /> as the step content slot.
 */
export default function ApplicationWizardPage() {
  useDocumentTitle('Application');
  return (
    <WizardProvider>
      <ApplicationWizardShell>
        <Outlet />
      </ApplicationWizardShell>
    </WizardProvider>
  );
}
