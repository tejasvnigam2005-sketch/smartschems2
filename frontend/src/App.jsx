import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BusinessFormPage from './pages/BusinessFormPage';
import EducationFormPage from './pages/EducationFormPage';
import ResultsPage from './pages/ResultsPage';
import UpdatesPage from './pages/UpdatesPage';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/business" element={<BusinessFormPage />} />
        <Route path="/education" element={<EducationFormPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
      </Routes>
    </Router>
  );
}
