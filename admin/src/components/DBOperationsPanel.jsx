import { useState } from 'react';
import { runDBScript, clearUserData } from '../api/adminApi';

export default function DBOperationsPanel() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [clearUserId, setClearUserId] = useState('');

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLogs(prev => [...prev, { type, message, timestamp }]);
  };

  const handleRunScript = async (script) => {
    setRunning(true);
    addLog('info', `Running ${script}...`);
    try {
      const res = await runDBScript(script);
      if (res.data.success) {
        addLog('success', `✓ ${script} completed successfully`);
        if (res.data.stdout) addLog('info', res.data.stdout);
      } else {
        addLog('error', `✗ ${script} failed (exit code: ${res.data.return_code})`);
        if (res.data.stderr) addLog('error', res.data.stderr);
      }
    } catch (err) {
      addLog('error', `✗ Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleClearUser = async () => {
    const userId = parseInt(clearUserId);
    if (!userId || isNaN(userId)) {
      addLog('error', '✗ Please enter a valid User ID');
      return;
    }

    setRunning(true);
    addLog('info', `Clearing data for user #${userId}...`);
    try {
      const res = await clearUserData(userId);
      addLog('success', `✓ ${res.data.message}`);
    } catch (err) {
      addLog('error', `✗ Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Operations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Run Migrations */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Run Schema Migration</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Execute schema.sql</div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={running}
            onClick={() => handleRunScript('schema.sql')}
          >
            {running ? 'Running...' : 'Run Migration'}
          </button>
        </div>

        {/* Seed Data */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.12)', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Seed Sample Data</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Execute sample_data.sql</div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={running}
            onClick={() => handleRunScript('sample_data.sql')}
          >
            {running ? 'Running...' : 'Seed Data'}
          </button>
        </div>

        {/* Clear User Data */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Clear User Data</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remove all expenses for a user</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              placeholder="User ID"
              value={clearUserId}
              onChange={(e) => setClearUserId(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-danger"
              disabled={running}
              onClick={handleClearUser}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Terminal Output</span>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setLogs([])}
          >
            Clear
          </button>
        </div>
        <div className="terminal" style={{ borderRadius: 0, border: 'none', minHeight: '200px' }}>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>
              <span className="prompt">$</span> Ready. Click an operation above to execute.
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className={log.type}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>[{log.timestamp}]</span>{' '}
                {log.message}
              </div>
            ))
          )}
          {running && (
            <div className="info" style={{ animation: 'pulse 1s infinite' }}>
              ⏳ Operation in progress...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
