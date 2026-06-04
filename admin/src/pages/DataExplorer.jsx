import { useState, useEffect } from 'react';
import { getUsers, getExpenses, getCategories } from '../api/adminApi';
import RawDataExplorer from '../components/RawDataExplorer';

const tableConfig = {
  users: { label: 'Users', pkField: 'user_id' },
  expenses: { label: 'Expenses', pkField: 'expense_id' },
  categories: { label: 'Categories', pkField: 'category_id' },
};

export default function DataExplorer() {
  const [activeTable, setActiveTable] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (table) => {
    setLoading(true);
    try {
      let res;
      switch (table) {
        case 'users':
          res = await getUsers(1, 200);
          setData(res.data.users);
          break;
        case 'expenses':
          res = await getExpenses({ page: 1, limit: 200 });
          setData(res.data.expenses);
          break;
        case 'categories':
          res = await getCategories();
          setData(res.data);
          break;
      }
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTable);
  }, [activeTable]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Data Explorer</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Browse raw data from any table · Double-click cells to edit
        </p>
      </div>

      {/* Table Selector */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {Object.entries(tableConfig).map(([key, config]) => (
          <button
            key={key}
            className={activeTable === key ? 'btn btn-primary' : 'btn btn-ghost'}
            onClick={() => setActiveTable(key)}
          >
            {config.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost" onClick={() => fetchData(activeTable)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Table Display */}
      {loading ? (
        <div className="glass-card loading-center">
          <div className="spinner" />
          <span>Loading {tableConfig[activeTable].label}...</span>
        </div>
      ) : (
        <RawDataExplorer
          data={data}
          tableName={activeTable}
          pkField={tableConfig[activeTable].pkField}
          onRefresh={() => fetchData(activeTable)}
        />
      )}
    </div>
  );
}
