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

  // --- API LOGIC FROM VERSION B (LIVE RENDER ENDPOINTS) ---
  
  const fetchGrievances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://bytequest-portal-backend.onrender.com/api/grievances');
      if (!response.ok) throw new Error(`Server status: ${response.status}`);
      const data = await response.json();
      setGrievances(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Live server is connecting. Showing demo data...');
      // Fallback Demo Data for UI Stability
      setGrievances([
        {
          _id: 'GRV-DE-2026',
          citizenName: 'Rajesh Kumar',
          category: 'Water & Sanitation',
          priority: 'critical',
          status: 'pending',
          createdAt: new Date().toISOString(),
          location: 'Indore, Madhya Pradesh',
          description: 'No water supply for 3 days in Sector 21. Urgent action needed.',
          aiSummary: 'Major infrastructure failure in residential sector.'
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
      // Local update for UX if API fails during demo
      setGrievances(prev => prev.map(g => 
        g._id === selectedGrievance._id ? { ...g, status: newStatus } : g
      ));
      setSelectedGrievance(prev => ({ ...prev, status: newStatus }));
      setShowStatusDropdown(false);
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  // --- UI HELPERS FROM VERSION A ---

  const openDetailsModal = (grievance) => {
    setSelectedGrievance(grievance);
    setShowModal(true);
    setShowStatusDropdown(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGrievance(null);
    setShowStatusDropdown(false);
  };

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status?.toLowerCase() === 'pending').length,
    inProgress: grievances.filter(g => g.status?.toLowerCase() === 'in-progress').length,
    resolved: grievances.filter(g => g.status?.toLowerCase() === 'resolved').length,
    critical: grievances.filter(g => g.priority?.toLowerCase() === 'critical').length
  };

  const filteredGrievances = grievances.filter(g => {
    const matchesFilter = filter === 'all' || g.status?.toLowerCase() === filter;
    const matchesSearch = !searchTerm || 
      (g._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { color: '#dc2626', bg: '#fef2f2', icon: '🔴', label: 'CRITICAL' },
      high: { color: '#f59e0b', bg: '#fffbeb', icon: '🟠', label: 'HIGH' },
      medium: { color: '#3b82f6', bg: '#eff6ff', icon: '🟡', label: 'MEDIUM' },
      low: { color: '#10b981', bg: '#f0fdf4', icon: '🟢', label: 'LOW' }
    };
    return configs[priority?.toLowerCase()] || configs.medium;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: '#f59e0b', bg: '#fffbeb', icon: '⏳', label: 'Pending' },
      'in-progress': { color: '#3b82f6', bg: '#eff6ff', icon: '⚙️', label: 'In Progress' },
      resolved: { color: '#10b981', bg: '#f0fdf4', icon: '✓', label: 'Resolved' },
      rejected: { color: '#dc2626', bg: '#fef2f2', icon: '✕', label: 'Rejected' }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Connecting to Government Portal...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top Header Bar */}
      <div style={styles.topBar}>
        <div style={styles.brandSection}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" 
            alt="India Flag" 
            style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <div>
            <h1 style={styles.brandTitle}>National Grievance Portal</h1>
            <p style={styles.brandSubtitle}>Government of India - Admin Dashboard</p>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => window.location.href = '/'} style={styles.homeBtn}>
            <span>←</span> Back to Home
          </button>
          <button onClick={fetchGrievances} style={styles.refreshBtn}>
            <span style={styles.refreshIcon}>↻</span> Refresh
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Welcome & Stats Section */}
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeHeader}>
            <div>
              <h2 style={styles.welcomeTitle}>Welcome, Administrator</h2>
              <p style={styles.welcomeText}>Real-time monitoring of citizen grievances via Render API</p>
            </div>
            {error && <div style={styles.errorBadge}>⚠️ {error}</div>}
          </div>
          
          <div style={styles.statsGrid}>
            <div style={{...styles.statCard, ...styles.statCardTotal}}>
              <div style={styles.statIcon}>📊</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{stats.total}</div>
                <div style={styles.statLabel}>Total</div>
              </div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardPending}}>
              <div style={styles.statIcon}>⏳</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{stats.pending}</div>
                <div style={styles.statLabel}>Pending</div>
              </div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardProgress}}>
              <div style={styles.statIcon}>⚙️</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{stats.inProgress}</div>
                <div style={styles.statLabel}>In Progress</div>
              </div>
            </div>
            <div style={{...styles.statCard, ...styles.statCardResolved}}>
              <div style={styles.statIcon}>✓</div>
              <div style={styles.statContent}>
                <div style={styles.statNumber}>{stats.resolved}</div>
                <div style={styles.statLabel}>Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={styles.controlsBar}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by ID, name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterGroup}>
            {['all', 'pending', 'in-progress', 'resolved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...styles.filterBtn,
                  ...(filter === f ? styles.filterBtnActive : {})
                }}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grievance Grid */}
        <div style={styles.cardsGrid}>
          {filteredGrievances.map((g, index) => {
            const pConfig = getPriorityConfig(g.priority);
            const sConfig = getStatusConfig(g.status);
            return (
              <div key={g._id} style={{...styles.grievanceCard, animation: `slideIn 0.4s ease ${index * 0.05}s both`}}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardId}>{g._id?.slice(-8).toUpperCase()}</div>
                  <div style={{...styles.priorityBadge, color: pConfig.color, background: pConfig.bg}}>
                    {pConfig.icon} {pConfig.label}
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{g.category}</h3>
                  <p style={styles.cardDescription}>{g.description?.substring(0, 100)}...</p>
                  <div style={styles.cardMeta}>
                    <div style={styles.metaItem}>👤 {g.citizenName}</div>
                    <div style={styles.metaItem}>📅 {new Date(g.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
                <div style={styles.cardFooter}>
                  <div style={{...styles.statusBadge, color: sConfig.color, background: sConfig.bg}}>
                    {sConfig.icon} {sConfig.label}
                  </div>
                  <button style={styles.actionBtn} onClick={() => openDetailsModal(g)}>
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {showModal && selectedGrievance && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
               <h2 style={styles.modalTitle}>Grievance Detail</h2>
               <span style={styles.modalId}>#{selectedGrievance._id?.slice(-8).toUpperCase()}</span>
               <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>
            <div style={styles.modalBody}>
               <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>📝 Citizen Description</h3>
                  <p style={styles.detailDescription}>{selectedGrievance.description}</p>
               </div>
               <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>🤖 AI Summary</h3>
                  <p style={styles.detailValue}>{selectedGrievance.aiSummary || "Processing summary..."}</p>
               </div>
               <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>👤 Reported By</h3>
                  <p style={styles.detailValue}>{selectedGrievance.citizenName}</p>
               </div>
            </div>
            <div style={styles.modalFooter}>
               <div style={styles.statusDropdownContainer}>
                  <button 
                    style={styles.modalActionBtn} 
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    {updatingStatus ? 'Updating...' : '⚡ Change Status'}
                  </button>
                  {showStatusDropdown && (
                    <div style={styles.statusDropdown}>
                      {['pending', 'in-progress', 'resolved', 'rejected'].map(st => (
                        <button key={st} style={styles.statusOption} onClick={() => updateGrievanceStatus(st)}>
                          {st.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
               </div>
               <button style={styles.modalCloseBtn} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES OBJECT (VERSION A's DARK THEME) ---
const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', fontFamily: "'Inter', sans-serif" },
  loadingContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  spinner: { width: '50px', height: '50px', border: '5px solid rgba(59, 130, 246, 0.2)', borderTop: '5px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { marginTop: '20px', color: '#94a3b8', fontWeight: '500' },
  topBar: { background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  brandSection: { display: 'flex', alignItems: 'center', gap: '16px' },
  brandTitle: { fontSize: '22px', fontWeight: '700', color: 'white', margin: 0 },
  brandSubtitle: { fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 },
  headerActions: { display: 'flex', gap: '12px' },
  homeBtn: { padding: '10px 18px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  refreshBtn: { padding: '10px 18px', background: 'white', color: '#1e40af', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  mainContent: { padding: '40px' },
  welcomeCard: { background: 'white', borderRadius: '16px', padding: '25px', marginBottom: '30px' },
  welcomeTitle: { fontSize: '24px', color: '#0f172a', margin: '0 0 5px 0' },
  welcomeText: { color: '#64748b', margin: 0 },
  errorBadge: { padding: '8px 15px', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '20px' },
  statCard: { background: '#f8fafc', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '5px solid' },
  statCardTotal: { borderLeftColor: '#3b82f6' },
  statCardPending: { borderLeftColor: '#f59e0b' },
  statCardProgress: { borderLeftColor: '#8b5cf6' },
  statCardResolved: { borderLeftColor: '#10b981' },
  statNumber: { fontSize: '28px', fontWeight: '800', color: '#0f172a' },
  statLabel: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' },
  controlsBar: { display: 'flex', gap: '15px', marginBottom: '25px' },
  searchBox: { flex: 1, background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '0 15px' },
  searchInput: { border: 'none', outline: 'none', width: '100%', padding: '12px', fontSize: '14px' },
  filterGroup: { display: 'flex', gap: '8px' },
  filterBtn: { padding: '10px 18px', borderRadius: '8px', border: 'none', background: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer' },
  filterBtnActive: { background: '#3b82f6', color: 'white' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' },
  grievanceCard: { background: 'white', borderRadius: '15px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardHeader: { padding: '15px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' },
  priorityBadge: { padding: '5px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' },
  cardTitle: { fontSize: '17px', fontWeight: '700', marginBottom: '10px' },
  cardDescription: { fontSize: '13px', color: '#64748b', lineHeight: '1.5' },
  cardFooter: { padding: '15px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' },
  actionBtn: { padding: '8px 15px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: 'white', width: '90%', maxWidth: '600px', borderRadius: '20px', overflow: 'hidden' },
  modalHeader: { background: '#1e40af', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalBody: { padding: '25px' },
  detailSection: { marginBottom: '20px' },
  detailLabel: { fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' },
  detailDescription: { background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' },
  modalFooter: { padding: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  modalActionBtn: { padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
  modalCloseBtn: { padding: '10px 20px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  statusDropdownContainer: { position: 'relative' },
  statusDropdown: { position: 'absolute', bottom: '100%', right: 0, background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  statusOption: { display: 'block', width: '100%', padding: '10px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }
};

// Injection of keyframes
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    button:hover { opacity: 0.9; transform: translateY(-1px); transition: 0.2s; }
  `;
  document.head.appendChild(styleSheet);
}

export default AdminDashboard;