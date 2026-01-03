import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import GrievanceForm from './GrievanceForm';
import TrackRequest from './TrackRequest';
import Navbar from './Navbar';

// Placeholder component until admin dashboard is implemented
const AdminDashboard = () => <div className="container"><h2>👮 Admin Dashboard Coming Soon...</h2></div>;

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/file-grievance" element={<GrievanceForm />} />
          <Route path="/track" element={<TrackRequest />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;