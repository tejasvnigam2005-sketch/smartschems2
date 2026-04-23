import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import ExploreSchemesPage from './pages/ExploreSchemesPage';
import BusinessFormPage from './pages/BusinessFormPage';
import EducationFormPage from './pages/EducationFormPage';
import ResultsPage from './pages/ResultsPage';
import UpdatesPage from './pages/UpdatesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EligibleSchemesPage from './pages/EligibleSchemesPage';
import DocumentStatusPage from './pages/DocumentStatusPage';
import { DashboardProvider } from './context/DashboardContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ChatBot from './components/ChatBot';
import ToastNotifications from './components/ToastNotifications';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DashboardProvider>
          <Router>
            <ScrollToTop />
            <Navbar />
            <PageTransition>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/explore" element={<ExploreSchemesPage />} />
                <Route path="/business" element={<BusinessFormPage />} />
                <Route path="/education" element={<EducationFormPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/updates" element={<UpdatesPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/eligible-schemes" element={<EligibleSchemesPage />} />
                <Route path="/document-status" element={<DocumentStatusPage />} />
              </Routes>
            </PageTransition>
            <ChatBot />
            <ToastNotifications />
          </Router>
        </DashboardProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
