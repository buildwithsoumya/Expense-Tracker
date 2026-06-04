import { useEffect, useState } from 'react';

const icons = {
  users: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  transactions: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  spend: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  categories: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
};

const colorMap = {
  emerald: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', glow: 'rgba(16, 185, 129, 0.2)' },
  blue: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.2)' },
  amber: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.2)' },
  purple: { bg: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.2)' },
};

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(value, Math.round(increment * step * 100) / 100);
      setDisplay(current);
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const formatted = typeof display === 'number' && display >= 1000
    ? display.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : display;

  return <span>{prefix}{formatted}{suffix}</span>;
}

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card" style={{ padding: '20px', height: '110px' }}>
            <div className="skeleton" style={{ width: '40px', height: '40px', marginBottom: '12px' }} />
            <div className="skeleton" style={{ width: '60%', height: '12px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '40%', height: '20px' }} />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { key: 'users', label: 'Total Users', value: stats?.user_count || 0, icon: 'users', theme: 'blue', prefix: '' },
    { key: 'transactions', label: 'Transactions', value: stats?.transaction_count || 0, icon: 'transactions', theme: 'emerald', prefix: '' },
    { key: 'spend', label: 'Total Spend', value: stats?.total_spend || 0, icon: 'spend', theme: 'amber', prefix: '₹' },
    { key: 'categories', label: 'Categories', value: stats?.category_breakdown?.length || 0, icon: 'categories', theme: 'purple', prefix: '' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
      {cards.map((card) => {
        const theme = colorMap[card.theme];
        return (
          <div key={card.key} className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            {/* Glow accent */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: theme.glow,
              filter: 'blur(30px)',
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '14px',
              position: 'relative',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: theme.bg,
                color: theme.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {icons[card.icon]}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {card.label}
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', position: 'relative' }}>
              <AnimatedNumber value={card.value} prefix={card.prefix} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
