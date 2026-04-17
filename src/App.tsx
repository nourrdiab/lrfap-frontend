import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { CenteredAuthLayout } from './layouts/CenteredAuthLayout';
import { ApplicantLayout } from './layouts/ApplicantLayout';
import { UniversityLayout } from './layouts/UniversityLayout';
import { LGCLayout } from './layouts/LGCLayout';

import LandingPage from './pages/public/LandingPage';
import ProgramCatalogPage from './pages/public/ProgramCatalogPage';
import AboutPage from './pages/public/AboutPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import ApplicantDashboardPage from './pages/applicant/DashboardPage';
import ApplicantProfileDocumentsPage from './pages/applicant/ProfileDocumentsPage';
import ApplicantMyApplicationsPage from './pages/applicant/MyApplicationsPage';
import ApplicantApplicationDetailPage from './pages/applicant/ApplicationDetailPage';
import ApplicantNotificationsPage from './pages/applicant/NotificationsPage';

import UniversityDashboardPage from './pages/university/DashboardPage';
import UniversityProgramApplicationsPage from './pages/university/ProgramApplicationsPage';
import UniversityRankingPage from './pages/university/RankingPage';

import LGCDashboardPage from './pages/lgc/DashboardPage';
import LGCCyclesPage from './pages/lgc/CyclesPage';
import LGCCatalogPage from './pages/lgc/CatalogPage';
import LGCMatchingPage from './pages/lgc/MatchingPage';
import LGCUsersAuditPage from './pages/lgc/UsersAuditPage';

import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing is full-bleed — it ships its own nav and footer, so it
              sits outside PublicLayout. */}
          <Route index element={<LandingPage />} />

          {/* Other public pages keep the scaffold PublicLayout shell until
              they're rebuilt from Figma. */}
          <Route element={<PublicLayout />}>
            <Route path="programs" element={<ProgramCatalogPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>

          {/* Auth — split layout (form + photo) for multi-field flows */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Auth — centered layout for single-field flows */}
          <Route element={<CenteredAuthLayout />}>
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Applicant portal */}
          <Route element={<ProtectedRoute allow={['applicant']} />}>
            <Route path="applicant" element={<ApplicantLayout />}>
              <Route index element={<ApplicantDashboardPage />} />
              <Route path="profile" element={<ApplicantProfileDocumentsPage />} />
              <Route path="applications" element={<ApplicantMyApplicationsPage />} />
              <Route
                path="applications/:id"
                element={<ApplicantApplicationDetailPage />}
              />
              <Route path="notifications" element={<ApplicantNotificationsPage />} />
            </Route>
          </Route>

          {/* University portal */}
          <Route element={<ProtectedRoute allow={['university']} />}>
            <Route path="university" element={<UniversityLayout />}>
              <Route index element={<UniversityDashboardPage />} />
              <Route
                path="programs"
                element={<UniversityProgramApplicationsPage />}
              />
              <Route
                path="programs/:id"
                element={<UniversityProgramApplicationsPage />}
              />
              <Route path="ranking" element={<UniversityRankingPage />} />
              <Route path="ranking/:id" element={<UniversityRankingPage />} />
            </Route>
          </Route>

          {/* LGC committee portal */}
          <Route element={<ProtectedRoute allow={['lgc']} />}>
            <Route path="lgc" element={<LGCLayout />}>
              <Route index element={<LGCDashboardPage />} />
              <Route path="cycles" element={<LGCCyclesPage />} />
              <Route path="catalog" element={<LGCCatalogPage />} />
              <Route path="matching" element={<LGCMatchingPage />} />
              <Route path="users" element={<LGCUsersAuditPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
