import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@gov.in' && password === 'admin321') {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 1500);
    } else {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      height: '100%',
      // MATCHED TO YOUR THEME: Deep Navy Blue gradient
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto',
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // Very subtle grid to make the white box feel grounded, not floating
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      pointerEvents: 'none',
    },
    card: {
      background: '#ffffff',
      borderRadius: '24px',
      padding: '56px 48px',
      width: '100%',
      maxWidth: '460px', // Optimal width for login forms
      // Deep shadow to match the "floating" aesthetic of your other cards
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
      position: 'relative',
      zIndex: 1,
      animation: shake ? 'shake 0.5s' : 'fadeIn 0.6s ease-out',
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    brandContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    flag: {
      fontSize: '32px',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
    },
    title: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0,
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '8px',
      fontWeight: '500',
    },
    adminBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: '#f1f5f9',
      color: '#475569',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginTop: '16px',
      border: '1px solid #e2e8f0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      position: 'relative',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      color: '#94a3b8',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      color: '#1e293b',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#fff',
    },
    inputFocus: {
      borderColor: '#3b82f6', // Bright blue focus to match your buttons
      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
    },
    passwordInput: {
      paddingRight: '48px',
    },
    eyeIcon: {
      position: 'absolute',
      right: '16px',
      cursor: 'pointer',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
    },
    errorBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #fecaca',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideDown 0.3s ease-out',
    },
    successBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#ecfdf5',
      color: '#065f46',
      border: '1px solid #a7f3d0',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      animation: 'slideDown 0.3s ease-out',
    },
    button: {
      // MATCHED TO YOUR THEME: The bright blue form button
      background: loading || success ? '#94a3b8' : '#2563eb', 
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading || success ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },
    demoHint: {
      textAlign: 'center',
      marginTop: '32px',
      fontSize: '13px',
      color: '#64748b', // Lighter slate for hints
    },
    checkmark: {
      animation: 'scaleIn 0.4s ease-out',
    },
  };

  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.brandContainer}>
              <span style={styles.flag}>🇮🇳</span>
              <h1 style={styles.title}>National Grievance Portal</h1>
            </div>
            <p style={styles.subtitle}>Government of India - Citizen Services</p>
            <div style={styles.adminBadge}>
              <Lock size={12} />
              <span>Administrator Access</span>
            </div>
          </div>

          <form style={styles.form} onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={20} style={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gov.in"
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={20} style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{...styles.input, ...styles.passwordInput}}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            {error && (
              <div style={styles.errorBadge}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={styles.successBadge}>
                <CheckCircle size={20} style={styles.checkmark} />
                <span>Login successful! Redirecting...</span>
              </div>
            )}

            <button
              type="submit"
              style={styles.button}
              disabled={loading || success}
              onMouseEnter={(e) => {
                if (!loading && !success) {
                  e.target.style.background = '#1d4ed8'; // Darker blue on hover
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !success) {
                  e.target.style.background = '#2563eb';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={styles.spinner}></div>
                  <span>Authenticating...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} />
                  <span>Success!</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={styles.demoHint}>
            Demo credentials: admin@gov.in / admin321
          </div>
        </div>
      </div>
    </>
  );
}