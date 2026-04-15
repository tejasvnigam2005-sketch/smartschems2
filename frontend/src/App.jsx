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

export default function App() {
  return (
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
        </Routes>
      </PageTransition>
    </Router>
  );
}
