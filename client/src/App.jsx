import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GrievanceForm from './GrievanceForm';
import Navbar from './Navbar';

// Placeholder components (So code doesn't break until teammates finish)
const TrackGrievance = () => <div className="container"><h2>🔍 Tracking Page Coming Soon...</h2></div>;
const AdminDashboard = () => <div className="container"><h2>👮 Admin Dashboard Coming Soon...</h2></div>;

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<GrievanceForm />} />
          <Route path="/track" element={<TrackGrievance />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;