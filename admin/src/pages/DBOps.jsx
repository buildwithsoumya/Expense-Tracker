import DBOperationsPanel from '../components/DBOperationsPanel';

export default function DBOps() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Database Operations</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Run migrations, seed data, and manage database state
        </p>
      </div>

      <DBOperationsPanel />
    </div>
  );
}
