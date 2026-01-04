import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function TrackRequest() {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [grievance, setGrievance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    setGrievance(null);

    // --- NEW: DEMO MODE FOR HACKATHON PRESENTATION ---
    if (trackingId.toUpperCase() === 'DEMO') {
      setTimeout(() => {
        setGrievance({
          _id: 'DEMO-X12345678',
          citizenName: 'Nishtha Lalwani',
          category: 'Infrastructure',
          priority: 'high',
          status: 'in-progress',
          createdAt: new Date().toISOString(),
          description: 'Significant road damage reported near the main market square, affecting local traffic and safety.',
          aiSummary: 'AI identifies this as a high-priority public safety issue requiring municipal attention.'
        });
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      // UPDATED: Changed from 3001 to 5000 to match your final server port
      const response = await fetch(`http://localhost:5000/api/grievance/${trackingId}`);
      const data = await response.json();

      if (response.ok && data) {
        setGrievance(data);
      } else {
        setError(data.message || 'Grievance not found. Please check your tracking number.');
      }
    } catch (err) {
      console.error('Track Error:', err);
      // Added port reminder for debugging
      setError('Unable to connect to server. Ensure backend is running on Port 5000.');
    }

    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return '#10b981';
      case 'in-progress': 
      case 'in progress': return '#3b82f6'; // Match Dashboard Blue
      case 'pending': return '#f59e0b'; // Match Dashboard Amber
      default: return '#6b7280';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
      case 'high': return { bg: '#fef2f2', color: '#dc2626', label: '🔴 High' };
      case 'medium': return { bg: '#fffbeb', color: '#d97706', label: '🟡 Medium' };
      case 'low': return { bg: '#f0fdf4', color: '#16a34a', label: '🟢 Low' };
      default: return { bg: '#f3f4f6', color: '#6b7280', label: priority };
    }
  };

  return (
    <div className="container">
      <div className="portal-header">
        <div className="portal-logo">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" 
            alt="India Flag" 
            style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <div className="logo-text">
            <h1>Track Your Grievance</h1>
            <p>National Grievance Portal - Government of India</p>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-section">
          <div className="section-header">
            <h2>🔍 Track Request Status</h2>
            <p>Enter your tracking number to check the status of your grievance</p>
          </div>

          <div className="form-group">
            <label>Tracking Number *</label>
            <div className="input-group" style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => {
                  setTrackingId(e.target.value);
                  setError('');
                }}
                placeholder="Enter Tracking ID (or 'DEMO')"
                style={{ flex: 1 }}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              />
              <button 
                onClick={handleTrack} 
                className="btn-primary"
                disabled={isLoading}
                style={{ minWidth: '120px' }}
              >
                {isLoading ? 'Searching...' : 'Track'}
              </button>
            </div>
            {error && <span className="error-text" style={{ color: '#ef4444', marginTop: '8px', display: 'block' }}>{error}</span>}
          </div>

          {grievance && (
            <div style={{ marginTop: '32px', animation: 'fadeInUp 0.5s ease-out' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '2px solid #0ea5e9',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ color: '#0369a1', margin: 0, fontSize: '18px' }}>Grievance Details</h3>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '13px' }}>ID: {grievance._id}</p>
                  </div>
                  <div style={{
                    background: getStatusColor(grievance.status),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {grievance.status?.toUpperCase() || 'PENDING'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Filed By</div>
                    <div style={{ color: '#1e293b', fontWeight: '600' }}>{grievance.citizenName}</div>
                  </div>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Category</div>
                    <div style={{ color: '#1e293b', fontWeight: '600' }}>{grievance.category || 'General'}</div>
                  </div>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Priority</div>
                    <div style={{
                      display: 'inline-block',
                      background: getPriorityBadge(grievance.priority).bg,
                      color: getPriorityBadge(grievance.priority).color,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {getPriorityBadge(grievance.priority).label}
                    </div>
                  </div>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Filed On</div>
                    <div style={{ color: '#1e293b', fontWeight: '600' }}>
                      {grievance.createdAt ? new Date(grievance.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>Description</div>
                  <div style={{ color: '#1e293b', lineHeight: '1.6' }}>{grievance.description}</div>
                </div>

                {grievance.aiSummary && (
                  <div style={{ 
                    background: '#f0fdf4', 
                    border: '1px solid #bbf7d0',
                    padding: '16px', 
                    borderRadius: '12px' 
                  }}>
                    <div style={{ color: '#166534', fontSize: '12px', marginBottom: '8px', fontWeight: '600' }}>
                      🤖 AI Summary
                    </div>
                    <div style={{ color: '#14532d', lineHeight: '1.6' }}>{grievance.aiSummary}</div>
                  </div>
                )}
              </div>

              {/* Timeline Section */}
              <div style={{ 
                background: 'white', 
                borderRadius: '16px', 
                padding: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ color: '#1e293b', marginTop: 0, marginBottom: '20px' }}>📋 Status Timeline</h4>
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '6px',
                    top: '8px',
                    bottom: '8px',
                    width: '2px',
                    background: '#e2e8f0'
                  }}></div>
                  
                  <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-20px',
                      top: '4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#10b981'
                    }}></div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>Grievance Registered</div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>
                      {grievance.createdAt ? new Date(grievance.createdAt).toLocaleString('en-IN') : 'N/A'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-20px',
                      top: '4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: grievance.status?.toLowerCase() !== 'pending' ? '#10b981' : '#e2e8f0'
                    }}></div>
                    <div style={{ fontWeight: '600', color: grievance.status?.toLowerCase() !== 'pending' ? '#1e293b' : '#94a3b8' }}>
                      Under Review
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>
                      {grievance.status?.toLowerCase() !== 'pending' ? 'Assigned to department' : 'Awaiting review'}
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-20px',
                      top: '4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: grievance.status?.toLowerCase() === 'resolved' ? '#10b981' : '#e2e8f0'
                    }}></div>
                    <div style={{ fontWeight: '600', color: grievance.status?.toLowerCase() === 'resolved' ? '#1e293b' : '#94a3b8' }}>
                      Resolution
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>
                      {grievance.status?.toLowerCase() === 'resolved' ? 'Issue resolved' : 'Pending resolution'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="action-buttons" style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate('/')} className="btn-secondary">
              ← Back to Home
            </button>
            <button onClick={() => navigate('/report')} className="btn-primary">
              File New Grievance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}