import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import GrievanceForm from './GrievanceForm';
import TrackRequest from './TrackRequest';
import AdminDashboard from './AdminBackup';
import AdminLogin from './AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/file-grievance" element={<GrievanceForm />} />
        <Route path="/track" element={<TrackRequest />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;