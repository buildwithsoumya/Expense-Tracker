import { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { getUserExpenses, deleteExpense, updateExpense, getCategories } from '../api/adminApi';

// ── Inline expandable expense rows for a single user ──────────────────────
function UserExpenseDrawer({ userId, userName }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [expRes, catRes] = await Promise.all([
        getUserExpenses(userId),
        getCategories(),
      ]);
      setExpenses(expRes.data.expenses ?? expRes.data);
      setCategories(catRes.data);
    } catch {
      showToast('error', 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (expenseId) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(expenseId);
      showToast('success', 'Expense deleted');
      fetchData();
    } catch {
      showToast('error', 'Failed to delete expense');
    }
  };

  const handleEditSave = async () => {
    try {
      await updateExpense(editExpense.expense_id, editForm);
      showToast('success', 'Expense updated');
      setEditExpense(null);
      fetchData();
    } catch (err) {
      showToast('error', 'Failed to update: ' + (err.response?.data?.detail || err.message));
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.category_id === id);
    return cat ? cat.category_name : '—';
  };

  return (
    <tr>
      <td
        colSpan="7"
        style={{
          padding: 0,
          background: 'rgba(245,158,11,0.03)',
          borderTop: '1px solid rgba(245,158,11,0.12)',
          borderBottom: '1px solid rgba(245,158,11,0.12)',
        }}
      >
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {userName}'s Expenses
          </span>
          {!loading && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {expenses.length} record{expenses.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '0 4px 4px' }}>
          {loading ? (
            <div className="loading-center" style={{ padding: '20px' }}>
              <div className="spinner" />
              <span>Loading expenses…</span>
            </div>
          ) : expenses.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              No expenses found for this user.
            </div>
          ) : (
            <table className="data-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.expense_id}>
                    <td>
                      <span className="badge badge-slate">#{exp.expense_id}</span>
                    </td>
                    <td style={{ color: 'var(--text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {exp.description || '—'}
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        {getCategoryName(exp.category_id)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {exp.date
                        ? new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '600', color: '#10b981' }}>
                      ₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          className="btn-icon"
                          title="Edit expense"
                          onClick={() => {
                            setEditExpense(exp);
                            setEditForm({
                              description: exp.description,
                              amount: exp.amount,
                              date: exp.date?.slice(0, 10),
                              category_id: exp.category_id,
                            });
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="btn-icon"
                          title="Delete expense"
                          onClick={() => handleDelete(exp.expense_id)}
                          style={{ color: 'var(--danger)' }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Toast inside drawer */}
        {toast && (
          <div className="toast-container">
            <div className={`toast toast-${toast.type}`}>{toast.message}</div>
          </div>
        )}

        {/* Edit expense modal */}
        <Modal
          isOpen={!!editExpense}
          onClose={() => setEditExpense(null)}
          title="Edit Expense"
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setEditExpense(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSave}>Save Changes</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
              <input
                type="text"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={editForm.amount || ''}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                value={editForm.date || ''}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</label>
              <select
                value={editForm.category_id || ''}
                onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
              >
                <option value="">— Select —</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      </td>
    </tr>
  );
}

// ── Main UserTable ─────────────────────────────────────────────────────────
export default function UserTable({ users, total, page, limit, onPageChange, onEdit, onDelete, loading }) {
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const totalPages = Math.ceil(total / limit);

  const handleEditOpen = (user) => {
    setEditUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleEditSave = () => {
    onEdit(editUser.user_id, editForm);
    setEditUser(null);
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirm.user_id);
    setDeleteConfirm(null);
    // Collapse drawer if deleting expanded user
    if (expandedUserId === deleteConfirm.user_id) setExpandedUserId(null);
  };

  const toggleExpand = (userId) => {
    setExpandedUserId(prev => (prev === userId ? null : userId));
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '20px', overflow: 'auto' }}>
        <div className="loading-center">
          <div className="spinner" />
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '32px' }} />
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Total Expenses</th>
                <th style={{ textAlign: 'right' }}>Count</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <h3>No users found</h3>
                    <p>Users will appear here once they register.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <>
                    <tr key={user.user_id} style={{ cursor: 'default' }}>
                      {/* Expand toggle */}
                      <td style={{ textAlign: 'center', paddingRight: '4px' }}>
                        <button
                          className="btn-icon"
                          title={expandedUserId === user.user_id ? 'Collapse expenses' : 'View expenses'}
                          onClick={() => toggleExpand(user.user_id)}
                          style={{
                            color: expandedUserId === user.user_id ? 'var(--accent)' : 'var(--text-muted)',
                            transition: 'color 150ms ease',
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transform: expandedUserId === user.user_id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 200ms ease',
                            }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      </td>

                      <td>
                        <span className="badge badge-slate">#{user.user_id}</span>
                      </td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {user.first_name} {user.last_name}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })
                          : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#10b981' }}>
                        ₹{parseFloat(user.total_expenses).toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'right' }}>{user.expense_count}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            className="btn-icon"
                            title="Edit user"
                            onClick={() => handleEditOpen(user)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="btn-icon"
                            title="Delete user"
                            onClick={() => setDeleteConfirm(user)}
                            style={{ color: 'var(--danger)' }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable expense drawer row */}
                    {expandedUserId === user.user_id && (
                      <UserExpenseDrawer
                        key={`drawer-${user.user_id}`}
                        userId={user.user_id}
                        userName={user.first_name}
                      />
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderTop: '1px solid var(--border-color)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </span>
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button key={p} className={p === page ? 'active' : ''} onClick={() => onPageChange(p)}>
                    {p}
                  </button>
                );
              })}
              <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setEditUser(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEditSave}>Save Changes</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>First Name</label>
            <input
              type="text"
              value={editForm.first_name || ''}
              onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Last Name</label>
            <input
              type="text"
              value={editForm.last_name || ''}
              onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email</label>
            <input
              type="email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete User"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete User</button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>
            {deleteConfirm?.first_name} {deleteConfirm?.last_name}
          </strong>? This will permanently delete all their expenses and custom categories.
        </p>
      </Modal>
    </>
  );
}
