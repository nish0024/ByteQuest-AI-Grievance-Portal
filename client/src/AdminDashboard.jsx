import { useState, useEffect } from 'react';

// 1. CRITICAL: The function name must be AdminDashboard to match your export and App.jsx import
export default function AdminDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // 2. Load data from Render on component mount
  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    setLoading(true);
    setError(null);
    try {
      // Direct call to your verified Render endpoint
      const response = await fetch('https://bytequest-portal-backend.onrender.com/api/grievances');
      
      if (!response.ok) {
         throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      // Success: Populate state with real data from MongoDB Atlas
      setGrievances(data); 
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Server is waking up or unreachable. Displaying demo data...');
      
      // Fallback: Demo data for when the Render server is "sleeping"
      setGrievances([
        {
          _id: 'DEMO101',
          citizenName: 'System Demo User',
          category: 'Infrastructure',
          priority: 'medium',
          status: 'pending',
          aiSummary: 'Example grievance for UI testing during server wake-up.',
          description: 'This is demo data because the server is currently spinning up.',
          createdAt: new Date().toISOString()
        }
      ]); 
    } finally {
      setLoading(false);
    }
  };

  const updateGrievanceStatus = async (newStatus) => {
    if (!selectedGrievance) return;
    setUpdatingStatus(true);
    try {
      const response = await fetch(`https://bytequest-portal-backend.onrender.com/api/grievance/${selectedGrievance._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
        
      if (response.ok) {
        setGrievances(prev => prev.map(g => 
          g._id === selectedGrievance._id ? { ...g, status: newStatus } : g
        ));
        setSelectedGrievance(prev => ({ ...prev, status: newStatus }));
        setShowStatusDropdown(false);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // --- UI Rendering Logic ---
  // (Include your styles and return statement here, exactly as they were)
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Admin Dashboard</h1>
      {loading ? <p>Loading...</p> : (
        <div>
          {error && <p style={{ color: 'orange' }}>{error}</p>}
          <ul>
            {grievances.map(g => (
              <li key={g._id}>{g.citizenName} - {g.status}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}