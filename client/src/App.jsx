import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import GrievanceForm from './GrievanceForm';
import TrackRequest from './TrackRequest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/file-grievance" element={<GrievanceForm />} />
        <Route path="/track" element={<TrackRequest />} />
      </Routes>
    </Router>
  );
}

export default App;