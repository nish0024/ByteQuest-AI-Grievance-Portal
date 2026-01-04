import { useState, useEffect } from 'react';

export default function AdminBackup() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  const updateGrievanceStatus = async (newStatus) => {
    if (!selectedGrievance) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`http://localhost:5000/api/grievances/${selectedGrievance._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        // Update local state
        setGrievances(prev => prev.map(g => 
          g._id === selectedGrievance._id ? { ...g, status: newStatus } : g
        ));
        setSelectedGrievance(prev => ({ ...prev, status: newStatus }));
        setShowStatusDropdown(false);
      } else {
        // Demo mode - update locally anyway
        setGrievances(prev => prev.map(g => 
          g._id === selectedGrievance._id ? { ...g, status: newStatus } : g
        ));
        setSelectedGrievance(prev => ({ ...prev, status: newStatus }));
        setShowStatusDropdown(false);
      }
    } catch (err) {
      // Demo mode - update locally
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

  const fetchGrievances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/grievances');
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
      (g.aiSummary || '').toLowerCase().includes(searchTerm.toLowerCase());
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
            <span>←</span>
            Back to Home
          </button>
          <button onClick={fetchGrievances} style={styles.refreshBtn}>
            <span style={styles.refreshIcon}>↻</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Welcome Section with Stats */}
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeHeader}>
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
          
          {/* Stats Grid - Now inside welcome card */}
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
              const priorityConfig = getPriorityConfig(grievance.priority?.toLowerCase());
              const statusConfig = getStatusConfig(grievance.status?.toLowerCase());
              
              return (
                <div 
                  key={grievance._id} 
                  style={{
                    ...styles.grievanceCard,
                    animation: `slideIn 0.4s ease ${index * 0.05}s both`
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.cardId}>{grievance._id?.slice(-8).toUpperCase() || 'N/A'}</div>
                    <div style={{
                      ...styles.priorityBadge,
                      color: priorityConfig.color,
                      background: priorityConfig.bg
                    }}>
                      {priorityConfig.icon} {priorityConfig.label}
                    </div>
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{grievance.category || 'Uncategorized'}</h3>
                    <p style={styles.cardDescription}>{grievance.description || 'No description provided'}</p>
                    
                    <div style={styles.cardMeta}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>👤</span>
                        <span>{grievance.citizenName || 'Anonymous'}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>📋</span>
                        <span>{grievance.aiSummary || 'No summary available'}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaIcon}>📅</span>
                        <span>{grievance.createdAt ? new Date(grievance.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}</span>
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
                      onClick={() => openDetailsModal(grievance)}
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

      {/* Details Modal */}
      {showModal && selectedGrievance && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitleSection}>
                <h2 style={styles.modalTitle}>Grievance Details</h2>
                <span style={styles.modalId}>#{selectedGrievance._id?.slice(-8).toUpperCase() || 'N/A'}</span>
              </div>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              {/* Status and Priority Section */}
              <div style={styles.statusSection}>
                <div style={{
                  ...styles.modalStatusBadge,
                  color: getStatusConfig(selectedGrievance.status?.toLowerCase()).color,
                  background: getStatusConfig(selectedGrievance.status?.toLowerCase()).bg
                }}>
                  {getStatusConfig(selectedGrievance.status?.toLowerCase()).icon} {getStatusConfig(selectedGrievance.status?.toLowerCase()).label}
                </div>
                <div style={{
                  ...styles.modalPriorityBadge,
                  color: getPriorityConfig(selectedGrievance.priority?.toLowerCase()).color,
                  background: getPriorityConfig(selectedGrievance.priority?.toLowerCase()).bg
                }}>
                  {getPriorityConfig(selectedGrievance.priority?.toLowerCase()).icon} {getPriorityConfig(selectedGrievance.priority?.toLowerCase()).label} Priority
                </div>
              </div>

              {/* Category */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailLabel}>📁 Category</h3>
                <p style={styles.detailValue}>{selectedGrievance.category || 'Uncategorized'}</p>
              </div>

              {/* Description */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailLabel}>📝 Description</h3>
                <p style={styles.detailDescription}>{selectedGrievance.description || 'No description provided'}</p>
              </div>

              {/* AI Summary */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailLabel}>🤖 AI Summary</h3>
                <p style={styles.detailValue}>{selectedGrievance.aiSummary || 'AI summary not available'}</p>
              </div>

              {/* Citizen Information */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailLabel}>👤 Citizen Information</h3>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Name:</span>
                    <span style={styles.infoValue}>{selectedGrievance.citizenName || selectedGrievance.name || 'Anonymous'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Email:</span>
                    <span style={styles.infoValue}>{selectedGrievance.email || 'Not provided'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Phone:</span>
                    <span style={styles.infoValue}>{selectedGrievance.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailLabel}>📍 Location</h3>
                <p style={styles.detailValue}>{selectedGrievance.location || 'Location not specified'}</p>
              </div>

              {/* Dates */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailLabel}>📅 Timeline</h3>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Filed On:</span>
                    <span style={styles.infoValue}>
                      {selectedGrievance.createdAt 
                        ? new Date(selectedGrievance.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : selectedGrievance.date || 'N/A'}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Last Updated:</span>
                    <span style={styles.infoValue}>
                      {selectedGrievance.updatedAt 
                        ? new Date(selectedGrievance.updatedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attachments if any */}
              {selectedGrievance.attachments && selectedGrievance.attachments.length > 0 && (
                <div style={styles.detailSection}>
                  <h3 style={styles.detailLabel}>📎 Attachments</h3>
                  <div style={styles.attachmentsList}>
                    {selectedGrievance.attachments.map((attachment, idx) => (
                      <a key={idx} href={attachment} target="_blank" rel="noopener noreferrer" style={styles.attachmentLink}>
                        Attachment {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.modalCloseBtn} onClick={closeModal}>
                Close
              </button>
              <div style={styles.statusDropdownContainer}>
                <button 
                  style={styles.modalActionBtn}
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? '⏳ Updating...' : '⚡ Update Status'}
                </button>
                {showStatusDropdown && (
                  <div style={styles.statusDropdown}>
                    <div style={styles.dropdownHeader}>Change Status To:</div>
                    <button 
                      style={{
                        ...styles.statusOption,
                        ...(selectedGrievance.status?.toLowerCase() === 'pending' ? styles.statusOptionActive : {})
                      }}
                      onClick={() => updateGrievanceStatus('pending')}
                    >
                      <span style={styles.statusDot('#f59e0b')}></span>
                      ⏳ Pending
                      {selectedGrievance.status?.toLowerCase() === 'pending' && <span style={styles.currentBadge}>Current</span>}
                    </button>
                    <button 
                      style={{
                        ...styles.statusOption,
                        ...(selectedGrievance.status?.toLowerCase() === 'in-progress' ? styles.statusOptionActive : {})
                      }}
                      onClick={() => updateGrievanceStatus('in-progress')}
                    >
                      <span style={styles.statusDot('#3b82f6')}></span>
                      ⚙️ In Progress
                      {selectedGrievance.status?.toLowerCase() === 'in-progress' && <span style={styles.currentBadge}>Current</span>}
                    </button>
                    <button 
                      style={{
                        ...styles.statusOption,
                        ...(selectedGrievance.status?.toLowerCase() === 'resolved' ? styles.statusOptionActive : {})
                      }}
                      onClick={() => updateGrievanceStatus('resolved')}
                    >
                      <span style={styles.statusDot('#10b981')}></span>
                      ✓ Resolved
                      {selectedGrievance.status?.toLowerCase() === 'resolved' && <span style={styles.currentBadge}>Current</span>}
                    </button>
                    <button 
                      style={{
                        ...styles.statusOption,
                        ...styles.statusOptionReject,
                        ...(selectedGrievance.status?.toLowerCase() === 'rejected' ? styles.statusOptionActive : {})
                      }}
                      onClick={() => updateGrievanceStatus('rejected')}
                    >
                      <span style={styles.statusDot('#dc2626')}></span>
                      ✕ Rejected
                      {selectedGrievance.status?.toLowerCase() === 'rejected' && <span style={styles.currentBadge}>Current</span>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
  
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  homeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backdropFilter: 'blur(4px)',
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
    width: '100%',
    padding: '40px 48px',
    boxSizing: 'border-box',
  },
  
  welcomeCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  
  welcomeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
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
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  
  statCard: {
    background: '#f1f5f9',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e2e8f0',
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

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.3s ease',
  },

  modalContent: {
    background: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
    animation: 'slideUp 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },

  modalHeader: {
    padding: '24px 32px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  modalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'white',
    margin: 0,
  },

  modalId: {
    padding: '6px 14px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'white',
    fontFamily: 'monospace',
  },

  closeBtn: {
    width: '40px',
    height: '40px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },

  modalBody: {
    padding: '32px',
    overflowY: 'auto',
    flex: 1,
  },

  statusSection: {
    display: 'flex',
    gap: '12px',
    marginBottom: '28px',
  },

  modalStatusBadge: {
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
  },

  modalPriorityBadge: {
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
  },

  detailSection: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #f1f5f9',
  },

  detailLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  detailValue: {
    fontSize: '16px',
    color: '#1e293b',
    margin: 0,
    fontWeight: '500',
  },

  detailDescription: {
    fontSize: '15px',
    color: '#475569',
    margin: 0,
    lineHeight: '1.7',
    background: '#f8fafc',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },

  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  infoLabel: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '600',
  },

  infoValue: {
    fontSize: '15px',
    color: '#1e293b',
    fontWeight: '500',
  },

  attachmentsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },

  attachmentLink: {
    padding: '10px 16px',
    background: '#eff6ff',
    color: '#3b82f6',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },

  modalFooter: {
    padding: '20px 32px',
    background: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },

  modalCloseBtn: {
    padding: '12px 24px',
    background: '#e2e8f0',
    color: '#475569',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  modalActionBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },

  // Status Dropdown Styles
  statusDropdownContainer: {
    position: 'relative',
  },

  statusDropdown: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: '8px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    minWidth: '200px',
    animation: 'slideUp 0.2s ease',
  },

  dropdownHeader: {
    padding: '12px 16px',
    background: '#f8fafc',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e2e8f0',
  },

  statusOption: {
    width: '100%',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'white',
    border: 'none',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'left',
  },

  statusOptionActive: {
    background: '#eff6ff',
  },

  statusOptionReject: {
    color: '#dc2626',
  },

  statusDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
  }),

  currentBadge: {
    marginLeft: 'auto',
    padding: '2px 8px',
    background: '#e0f2fe',
    color: '#0369a1',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
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
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
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