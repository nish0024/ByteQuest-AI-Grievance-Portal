import { Link } from 'react-router-dom';
import './App.css';

export default function Navbar() {
  return (
    <nav style={{
      background: 'white',
      padding: '16px 32px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ fontWeight: '800', fontSize: '20px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🇮🇳</span> CivicPulse
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#64748b', fontWeight: '500' }}>File Grievance</Link>
        <Link to="/track" style={{ textDecoration: 'none', color: '#64748b', fontWeight: '500' }}>Track Status</Link>
        <Link to="/admin" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: '600' }}>Admin Login</Link>
      </div>
    </nav>
  );
}