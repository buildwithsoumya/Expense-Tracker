import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getExpenses, updateExpense, deleteExpense,
  bulkDeleteExpenses, exportExpensesCSV, getCategories
} from '../api/adminApi';
import ExpenseTable from '../components/ExpenseTable';

export default function Expenses() {
  const [searchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    user_id: searchParams.get('user_id') || '',
    category_id: '',
    start_date: '',
    end_date: '',
    min_amount: '',
    max_amount: '',
  });

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      // silently fail — categories are optional for display
    }
  };

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (filters.user_id) params.user_id = filters.user_id;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      if (filters.min_amount) params.min_amount = filters.min_amount;
      if (filters.max_amount) params.max_amount = filters.max_amount;

      const res = await getExpenses(params);
      setExpenses(res.data.expenses);
      setTotal(res.data.total);
      setSelectedIds([]);
    } catch (err) {
      showToast('error', 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = async (expenseId, data) => {
    try {
      await updateExpense(expenseId, data);
      showToast('success', 'Expense updated');
      fetchExpenses();
    } catch (err) {
      showToast('error', 'Failed to update: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (expenseId) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(expenseId);
      showToast('success', 'Expense deleted');
      fetchExpenses();
    } catch (err) {
      showToast('error', 'Failed to delete');
    }
  };

  const handleBulkDelete = async (ids) => {
    if (!confirm(`Delete ${ids.length} expense(s)?`)) return;
    try {
      const res = await bulkDeleteExpenses(ids);
      showToast('success', res.data.message);
      fetchExpenses();
    } catch (err) {
      showToast('error', 'Bulk delete failed');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = {};
      if (filters.user_id) params.user_id = filters.user_id;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const res = await exportExpensesCSV(params);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('success', 'CSV exported successfully');
    } catch (err) {
      showToast('error', 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleSelectToggle = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === expenses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(expenses.map(e => e.expense_id));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ user_id: '', category_id: '', start_date: '', end_date: '', min_amount: '', max_amount: '' });
    setPage(1);
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Expenses</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            All transactions · {total} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost" onClick={handleExport} disabled={exporting}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button className="btn btn-ghost" onClick={fetchExpenses}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          alignItems: 'end',
        }}>
          <div>
            <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.user_id}
              onChange={(e) => handleFilterChange('user_id', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
            >
              <option value="">All</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="₹0"
              value={filters.min_amount}
              onChange={(e) => handleFilterChange('min_amount', e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Amount</label>
            <input
              type="number"
              step="0.01"
              placeholder="₹∞"
              value={filters.max_amount}
              onChange={(e) => handleFilterChange('max_amount', e.target.value)}
            />
          </div>
          {hasFilters && (
            <div>
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ marginTop: '18px' }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <ExpenseTable
        expenses={expenses}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        selectedIds={selectedIds}
        onSelectToggle={handleSelectToggle}
        onSelectAll={handleSelectAll}
        loading={loading}
        categories={categories}
      />

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>{toast.message}</div>
        </div>
      )}
    </div>
  );
}
