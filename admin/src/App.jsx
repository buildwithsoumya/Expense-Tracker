import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Expenses from './pages/Expenses';
import DataExplorer from './pages/DataExplorer';
import DBOps from './pages/DBOps';

function LoginScreen({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userId,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        sessionStorage.setItem('adminToken', data.access_token);
        sessionStorage.setItem('adminLoggedIn', 'true');
        onLogin();
      } else {
        setError(data.detail || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.06)',
        filter: 'blur(100px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '30%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(59, 130, 246, 0.04)',
        filter: 'blur(80px)',
      }} />

      <div className="animate-slide-up" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '0 20px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/favicon.png" alt="SmartSpend AI" style={{
            width: '56px',
            height: '56px',
            marginBottom: '16px',
          }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>
            SmartSpend AI Admin
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Management Console
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  User ID
                </label>
                <input
                  id="login-userid"
                  type="text"
                  placeholder="Enter admin ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  autoFocus
                  autoComplete="username"
                />
              </div>
              <div>
                <label style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div style={{
                  padding: '10px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#f87171',
                  fontSize: '0.8125rem',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '0.875rem',
                  justifyContent: 'center',
                  marginTop: '4px',
                }}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </div>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: '20px',
        }}>
          Expense Tracker Admin Panel v1.0
        </p>
      </div>
    </div>
  );
}

function AppLayout() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setLoggedIn(true);

  const handleLogout = () => {
    sessionStorage.removeItem('adminSecret');
    sessionStorage.removeItem('adminLoggedIn');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <main style={{
        flex: 1,
        marginLeft: '240px',
        padding: '24px',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/data-explorer" element={<DataExplorer />} />
          <Route path="/db-ops" element={<DBOps />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <AppLayout />;
}
