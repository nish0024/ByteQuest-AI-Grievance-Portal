import { useState, useEffect } from 'react';

export default function AdminBackup() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/grievances');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setGrievances(data);
    } catch (err) {
      setError('Unable to connect to server');
      // Demo data with enhanced fields
      setGrievances([
        {
          id: 'GRV20260104',
          name: 'Rajesh Kumar',
          category: 'Water & Sanitation',
          priority: 'critical',
          status: 'pending',
          date: '2026-01-04',
          location: 'Indore, Madhya Pradesh',
          description: 'No water supply for 3 days in Sector 21. Urgent action needed.'
        },
        {
          id: 'GRV20260103',
          name: 'Priya Sharma',
          category: 'Road & Transport',
          priority: 'high',
          status: 'in-progress',
          date: '2026-01-03',
          location: 'Mumbai, Maharashtra',
          description: 'Large pothole causing accidents on Western Express Highway'
        },
        {
          id: 'GRV20260102',
          name: 'Amit Patel',
          category: 'Electricity Board',
          priority: 'medium',
          status: 'resolved',
          date: '2026-01-02',
          location: 'Delhi, Delhi',
          description: 'Street light not working near bus stop'
        },
        {
          id: 'GRV20260101',
          name: 'Sneha Reddy',
          category: 'Public Health',
          priority: 'critical',
          status: 'pending',
          date: '2026-01-01',
          location: 'Bangalore, Karnataka',
          description: 'Garbage not collected for over a week, causing health hazards'
        },
        {
          id: 'GRV20251230',
          name: 'Mohammed Ali',
          category: 'Municipal Services',
          priority: 'low',
          status: 'resolved',
          date: '2025-12-30',
          location: 'Hyderabad, Telangana',
          description: 'Park maintenance required'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'pending').length,
    inProgress: grievances.filter(g => g.status === 'in-progress').length,
    resolved: grievances.filter(g => g.status === 'resolved').length,
    critical: grievances.filter(g => g.priority === 'critical').length
  };

  const filteredGrievances = grievances.filter(g => {
    const matchesFilter = filter === 'all' || g.status === filter;
    const matchesSearch = !searchTerm || 
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { color: '#dc2626', bg: '#fef2f2', icon: '🔴', label: 'CRITICAL' },
      high: { color: '#f59e0b', bg: '#fffbeb', icon: '🟠', label: 'HIGH' },
      medium: { color: '#3b82f6', bg: '#eff6ff', icon: '🟡', label: 'MEDIUM' },
      low: { color: '#10b981', bg: '#f0fdf4', icon: '🟢', label: 'LOW' }
    };
    return configs[priority] || configs.medium;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: '#f59e0b', bg: '#fffbeb', icon: '⏳', label: 'Pending' },
      'in-progress': { color: '#3b82f6', bg: '#eff6ff', icon: '⚙️', label: 'In Progress' },
      resolved: { color: '#10b981', bg: '#f0fdf4', icon: '✓', label: 'Resolved' }
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Top Header Bar */}
      <div style={styles.topBar}>
        <div style={styles.brandSection}>
          <div style={styles.flag}>🇮🇳</div>
          <div>
            <h1 style={styles.brandTitle}>National Grievance Portal</h1>
            <p style={styles.brandSubtitle}>Government of India - Admin Dashboard</p>
          </div>
        </div>
        <button onClick={fetchGrievances} style={styles.refreshBtn}>
          <span style={styles.refreshIcon}>↻</span>
          Refresh
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Welcome Section */}
        <div style={styles.welcomeCard}>
          <div>
            <h2 style={styles.welcomeTitle}>Welcome, Administrator</h2>
            <p style={styles.welcomeText}>Monitor and manage citizen grievances in real-time</p>
          </div>
          {error && (
            <div style={styles.errorBadge}>
              ⚠️ Demo Mode - {error}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, ...styles.statCardTotal}}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{stats.total}</div>
              <div style={styles.statLabel}>Total Grievances</div>
            </div>
          </div>

          <div style={{...styles.statCard, ...styles.statCardPending}}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{stats.pending}</div>
              <div style={styles.statLabel}>Pending Review</div>
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

        {/* Controls Bar */}
        <div style={styles.controlsBar}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by ID, name, category, or location..."
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
                {f === 'all' ? 'All' : 
                 f === 'in-progress' ? 'In Progress' :
                 f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.resultInfo}>
          Showing <strong>{filteredGrievances.length}</strong> of <strong>{grievances.length}</strong> grievances
        </div>

        {/* Grievances Grid */}
        {filteredGrievances.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>No Grievances Found</h3>
            <p style={styles.emptyText}>
              {searchTerm ? 'Try adjusting your search terms' : 
               filter === 'all' ? 'No grievances in the system yet' : 
               `No ${filter} grievances at the moment`}
            </p>
          </div>
        ) : (
          <div style={styles.cardsGrid}>
            {filteredGrievances.map((grievance, index) => {
              const priorityConfig = getPriorityConfig(grievance.priority);
              const statusConfig = getStatusConfig(grievance.status);
              
              return (
                <div 
                  key={grievance.id} 
                  style={{
                    ...styles.grievanceCard,
                    animation: `slideIn 0.4s ease ${index * 0.05}s both`
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.cardId}>{grievance.id}</div>
                    <div style={{
                      ...styles.priorityBadge,
                      color: priorityConfig.color,
                      background: priorityConfig.bg
                    }}>
                      {priorityConfig.icon} {priorityConfig.label}
                    </div>
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{grievance.category}</h3>
                    <p style={styles.cardDescription}>{grievance.description}</p>
                    
                    <div style={styles.cardMeta}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>👤</span>
                        <span>{grievance.name}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>📍</span>
                        <span>{grievance.location}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>📅</span>
                        <span>{new Date(grievance.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <div style={{
                      ...styles.statusBadge,
                      color: statusConfig.color,
                      background: statusConfig.bg
                    }}>
                      {statusConfig.icon} {statusConfig.label}
                    </div>
                    <button 
                      style={styles.actionBtn}
                      onClick={() => alert(`Viewing details for ${grievance.id}`)}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
  },
  
  spinner: {
    width: '60px',
    height: '60px',
    border: '5px solid rgba(59, 130, 246, 0.2)',
    borderTop: '5px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    marginTop: '24px',
    color: '#94a3b8',
    fontSize: '18px',
    fontWeight: '500',
  },
  
  topBar: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    padding: '24px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  
  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  
  flag: {
    fontSize: '48px',
  },
  
  brandTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 4px 0',
  },
  
  brandSubtitle: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
    fontWeight: '500',
  },
  
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'white',
    color: '#1e40af',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  
  refreshIcon: {
    fontSize: '18px',
    fontWeight: '700',
  },
  
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px',
  },
  
  welcomeCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  
  welcomeText: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
  },
  
  errorBadge: {
    padding: '12px 20px',
    background: '#fef2f2',
    border: '2px solid #fecaca',
    borderRadius: '10px',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '600',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    borderLeft: '5px solid',
    transition: 'all 0.3s',
  },
  
  statCardTotal: { borderLeftColor: '#3b82f6' },
  statCardPending: { borderLeftColor: '#f59e0b' },
  statCardProgress: { borderLeftColor: '#8b5cf6' },
  statCardResolved: { borderLeftColor: '#10b981' },
  
  statIcon: {
    fontSize: '40px',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    borderRadius: '14px',
  },
  
  statContent: {
    flex: 1,
  },
  
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px',
  },
  
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  controlsBar: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  
  searchBox: {
    flex: '1 1 400px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '12px',
    padding: '0 20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  
  searchIcon: {
    fontSize: '20px',
    marginRight: '12px',
  },
  
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '16px 0',
    fontSize: '15px',
    color: '#0f172a',
    background: 'transparent',
  },
  
  filterGroup: {
    display: 'flex',
    gap: '12px',
  },
  
  filterBtn: {
    padding: '14px 24px',
    background: 'white',
    color: '#64748b',
    border: '2px solid transparent',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
  },
  
  filterBtnActive: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  
  resultInfo: {
    color: '#cbd5e1',
    fontSize: '14px',
    marginBottom: '24px',
    fontWeight: '500',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'white',
    borderRadius: '20px',
    marginTop: '40px',
  },
  
  emptyIcon: {
    fontSize: '72px',
    marginBottom: '20px',
  },
  
  emptyTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '12px',
  },
  
  emptyText: {
    color: '#64748b',
    fontSize: '16px',
  },
  
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px',
  },
  
  grievanceCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s',
    display: 'flex',
    flexDirection: 'column',
  },
  
  cardHeader: {
    padding: '20px 24px',
    background: '#f8fafc',
    borderBottom: '2px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  cardId: {
    fontFamily: 'monospace',
    fontSize: '14px',
    fontWeight: '700',
    color: '#3b82f6',
  },
  
  priorityBadge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  cardBody: {
    padding: '24px',
    flex: 1,
  },
  
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '12px',
  },
  
  cardDescription: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  
  cardMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#475569',
  },
  
  metaIcon: {
    fontSize: '16px',
  },
  
  cardFooter: {
    padding: '20px 24px',
    background: '#f8fafc',
    borderTop: '2px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  
  actionBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
  }
  .grievanceCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
  }
  .statCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }
`;
document.head.appendChild(styleSheet);