import { useState, useEffect } from 'react';
import { getStats } from '../api/adminApi';
import StatsCards from '../components/StatsCards';
import { CategoryBreakdownChart, DailyActivityChart, TopSpendersTable } from '../components/Charts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getStats();
      setStats(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ color: 'var(--danger)', marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>
            Failed to load dashboard
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={fetchStats}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Overview of your expense tracker platform</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchStats}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: '600', marginBottom: '16px' }}>
            Spending by Category
          </h2>
          <CategoryBreakdownChart data={stats?.category_breakdown || []} />
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: '600', marginBottom: '16px' }}>
            Daily Activity
          </h2>
          <DailyActivityChart data={stats?.daily_activity || []} />
        </div>
      </div>

      {/* Top Spenders */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: '600', marginBottom: '16px' }}>
          Top Spenders
        </h2>
        <TopSpendersTable data={stats?.top_spenders || []} />
      </div>
    </div>
  );
}
