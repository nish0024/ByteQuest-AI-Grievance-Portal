import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  // FIXED: Removed the duplicate 'grievances' line that was causing the build crash
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // 1. Define the Fetch Logic
  const fetchGrievances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://bytequest-portal-backend.onrender.com/api/grievances');
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const data = await response.json();
      setGrievances(data); 
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Server is waking up or unreachable. Displaying demo data...');
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

  // 2. Define the Status Update Logic
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

  // 3. Trigger the fetch on load
  useEffect(() => {
    fetchGrievances();
  }, []);

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#121212', minHeight: '100vh' }}>
      <h1>Admin Dashboard</h1>
      <hr />
      {loading ? (
        <p>Loading grievances from Render...</p>
      ) : (
        <div>
          {error && <p style={{ color: '#ff9800' }}>{error}</p>}
          <div style={{ display: 'grid', gap: '15px' }}>
            {grievances.map((g) => (
              <div key={g._id || Math.random()} style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
                <h3>{g.citizenName}</h3>
                <p><strong>Status:</strong> {g.status}</p>
                <p>{g.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;