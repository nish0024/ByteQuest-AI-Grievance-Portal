import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // THE "FAKE" SECURITY CHECK
    if (email === 'admin@gov.in' && password === 'admin123') {
      navigate('/dashboard'); // Redirects to your actual dashboard
    } else {
      setError('Invalid credentials. Try admin@gov.in / admin123');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.flag}>🇮🇳</div>
          <h2 style={styles.title}>Official Login</h2>
          <p style={styles.subtitle}>Restricted Access • Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Govt ID / Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gov.in"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            Access Dashboard
          </button>
        </form>
        
        <p style={{marginTop: '20px', fontSize: '12px', color: '#94a3b8'}}>
          Demo Credentials: admin@gov.in / admin123
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  flag: { fontSize: '40px', marginBottom: '10px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#1e40af', margin: '0 0 5px 0' },
  subtitle: { fontSize: '13px', color: '#64748b', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { textAlign: 'left' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' },
  input: {
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1',
    fontSize: '15px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box'
  },
  button: {
    padding: '14px', background: '#2563eb', color: 'white', border: 'none',
    borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    marginTop: '10px', transition: 'background 0.2s'
  },
  error: { color: '#ef4444', fontSize: '13px', fontWeight: '600', background: '#fef2f2', padding: '10px', borderRadius: '6px' }
};