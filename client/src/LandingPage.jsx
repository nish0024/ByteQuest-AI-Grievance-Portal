import { useNavigate } from 'react-router-dom';
import './App.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="portal-header">
        <div className="portal-logo">
          <div className="logo-icon">🇮🇳</div>
          <div className="logo-text">
            <h1>National Grievance Portal</h1>
            <p>Government of India - Citizen Services</p>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-section">
          <div className="section-header" style={{ textAlign: 'center', borderBottom: 'none' }}>
            <h1>Welcome to the Portal</h1>
            <br></br>
            <h4>Your voice matters. We are here to help resolve your concerns efficiently.</h4>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginTop: '40px'
          }}>
            {/* File Complaint Card */}
            <div 
              onClick={() => navigate('/file-grievance')}
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '2px solid #86efac',
                borderRadius: '16px',
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              className="landing-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(34, 197, 94, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ 
                color: '#166534', 
                fontSize: '22px', 
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                File Complaint
              </h3>
              <p style={{ 
                color: '#15803d', 
                fontSize: '14px', 
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                Submit a new grievance to the concerned department and get a tracking number.
              </p>
              <button 
                className="btn-primary"
                style={{ 
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  width: '100%',
                  padding: '14px 24px'
                }}
              >
                File New Complaint →
              </button>
            </div>

            {/* Track Complaint Card */}
            <div 
              onClick={() => navigate('/track')}
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '2px solid #93c5fd',
                borderRadius: '16px',
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              className="landing-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ 
                color: '#1e40af', 
                fontSize: '22px', 
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                Track Complaint
              </h3>
              <p style={{ 
                color: '#1d4ed8', 
                fontSize: '14px', 
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                Already filed a complaint? Enter your tracking number to check the current status and updates.
              </p>
              <button 
                className="btn-primary"
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  width: '100%',
                  padding: '14px 24px'
                }}
              >
                Track Status →
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div style={{
            marginTop: '48px',
            padding: '24px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ color: '#1e293b', marginTop: 0, marginBottom: '16px', textAlign: 'center' }}>
              📌 How it works
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#3b82f6', 
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontWeight: '700'
                }}>1</div>
                <div style={{ color: '#1e293b', fontWeight: '600', fontSize: '14px' }}>Submit Details</div>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Fill out the grievance form</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#3b82f6', 
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontWeight: '700'
                }}>2</div>
                <div style={{ color: '#1e293b', fontWeight: '600', fontSize: '14px' }}>AI Analysis</div>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Auto-categorized & prioritized</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#3b82f6', 
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontWeight: '700'
                }}>3</div>
                <div style={{ color: '#1e293b', fontWeight: '600', fontSize: '14px' }}>Track Progress</div>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Monitor resolution status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '24px', 
        color: 'rgba(255,255,255,0.7)',
        fontSize: '13px'
      }}>
        <p>© 2026 National Grievance Portal | Government of India</p>
        <p style={{ marginTop: '4px' }}>Powered by AI for faster resolution</p>
      </div>
    </div>
  );
}
