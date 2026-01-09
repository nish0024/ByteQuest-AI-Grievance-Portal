import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // 1. Fetch from LIVE Render API
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
      setError('Live server is waking up. Showing demo data...');
      setGrievances([
        {
          _id: 'GRV-DE-101',
          citizenName: 'Rajesh Kumar',
          category: 'Water Supply',
          priority: 'critical',
          status: 'pending',
          description: 'No water supply for 3 days in Sector 21.',
          aiSummary: 'Infrastructure failure reported in Indore.',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Status on LIVE Render API
  const updateGrievanceStatus = async (newStatus) => {
    if (!selectedGrievance) return;
    setUpdatingStatus(true);
    try {
      const response = await fetch(`https://bytequest-portal-backend.onrender.com/api/grievances/${selectedGrievance._id}/status`, {
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

  useEffect(() => {
    fetchGrievances();
  }, []);

  // Helpers for UI
  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status?.toLowerCase() === 'pending').length,
    resolved: grievances.filter(g => g.status?.toLowerCase() === 'resolved').length,
    critical: grievances.filter(g => g.priority?.toLowerCase() === 'critical').length
  };

  const filteredGrievances = grievances.filter(g => {
    const matchesFilter = filter === 'all' || g.status?.toLowerCase() === filter;
    const matchesSearch = !searchTerm || 
      (g.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div style={styles.loadingContainer}><div style={styles.spinner}></div><p style={styles.loadingText}>Connecting to Government Portal...</p></div>;

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.topBar}>
        <div style={styles.brandSection}>
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" alt="India Flag" style={{ width: '48px', height: '32px', borderRadius: '4px' }} />
          <div>
            <h1 style={styles.brandTitle}>National Grievance Portal</h1>
            <p style={styles.brandSubtitle}>Admin Dashboard</p>
          </div>
        </div>
        <button onClick={fetchGrievances} style={styles.refreshBtn}>↻ Refresh</button>
      </div>

      <div style={styles.mainContent}>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, borderLeft: '5px solid #3b82f6'}}>
            <h2 style={styles.statNumber}>{stats.total}</h2>
            <p style={styles.statLabel}>Total</p>
          </div>
          <div style={{...styles.statCard, borderLeft: '5px solid #f59e0b'}}>
            <h2 style={styles.statNumber}>{stats.pending}</h2>
            <p style={styles.statLabel}>Pending</p>
          </div>
          <div style={{...styles.statCard, borderLeft: '5px solid #10b981'}}>
            <h2 style={styles.statNumber}>{stats.resolved}</h2>
            <p style={styles.statLabel}>Resolved</p>
          </div>
          <div style={{...styles.statCard, borderLeft: '5px solid #dc2626'}}>
            <h2 style={styles.statNumber}>{stats.critical}</h2>
            <p style={styles.statLabel}>Critical</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div style={styles.controlsBar}>
          <input 
            style={styles.searchInput} 
            placeholder="Search grievances..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select style={styles.filterBtn} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Cards Grid */}
        <div style={styles.cardsGrid}>
          {filteredGrievances.map((g) => (
            <div key={g._id} style={styles.grievanceCard}>
              <div style={styles.cardHeader}>
                <span style={styles.cardId}>ID: {g._id?.slice(-6)}</span>
                <span style={{...styles.priorityBadge, backgroundColor: g.priority === 'critical' ? '#fee2e2' : '#fef3c7', color: g.priority === 'critical' ? '#991b1b' : '#92400e'}}>
                  {g.priority?.toUpperCase()}
                </span>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{g.category}</h3>
                <p style={styles.cardDescription}>{g.description}</p>
                <div style={styles.metaItem}>👤 {g.citizenName}</div>
                <div style={styles.metaItem}>📅 {new Date(g.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={styles.cardFooter}>
                <span style={{...styles.statusBadge, color: g.status === 'resolved' ? '#065f46' : '#92400e'}}>
                  {g.status?.toUpperCase()}
                </span>
                <button 
                   style={styles.actionBtn}
                   onClick={() => { setSelectedGrievance(g); setShowModal(true); }}
                >Update</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Update Modal */}
      {showModal && selectedGrievance && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Update Grievance Status</h3>
            <p>ID: {selectedGrievance._id}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => updateGrievanceStatus('resolved')} style={styles.actionBtn}>Mark Resolved</button>
              <button onClick={() => updateGrievanceStatus('in-progress')} style={{...styles.actionBtn, background: '#3b82f6'}}>In Progress</button>
              <button onClick={() => setShowModal(false)} style={styles.modalCloseBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Merged Professional Styles
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' },
  topBar: { background: '#1e40af', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
  brandSection: { display: 'flex', alignItems: 'center', gap: '15px' },
  brandTitle: { fontSize: '20px', margin: 0 },
  brandSubtitle: { fontSize: '12px', opacity: 0.8, margin: 0 },
  refreshBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  mainContent: { padding: '40px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  statNumber: { fontSize: '24px', margin: '0 0 5px 0' },
  statLabel: { fontSize: '12px', color: '#64748b', textTransform: 'uppercase' },
  controlsBar: { display: 'flex', gap: '15px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  filterBtn: { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  grievanceCard: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  cardHeader: { padding: '15px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between' },
  cardId: { fontSize: '12px', fontWeight: 'bold', color: '#3b82f6' },
  priorityBadge: { padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' },
  cardBody: { padding: '20px', flex: 1 },
  cardTitle: { fontSize: '18px', margin: '0 0 10px 0' },
  cardDescription: { fontSize: '14px', color: '#64748b', marginBottom: '15px' },
  metaItem: { fontSize: '12px', color: '#475569', marginBottom: '5px' },
  cardFooter: { padding: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { fontSize: '12px', fontWeight: 'bold' },
  actionBtn: { padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  loadingContainer: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { background: 'white', padding: '30px', borderRadius: '15px', width: '400px' },
  modalCloseBtn: { padding: '8px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default AdminDashboard;