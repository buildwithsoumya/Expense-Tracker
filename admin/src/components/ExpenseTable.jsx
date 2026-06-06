import { useState } from 'react';

export default function ExpenseTable({
  expenses, total, page, limit, onPageChange,
  onEdit, onDelete, onBulkDelete, selectedIds, onSelectToggle, onSelectAll,
  loading, categories = []
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const totalPages = Math.ceil(total / limit);
  const allSelected = expenses.length > 0 && selectedIds.length === expenses.length;

  const startEditing = (exp) => {
    setEditingId(exp.expense_id);
    setEditForm({
      category_id: exp.category_id,
      amount: exp.amount,
      description: exp.description,
      payment_method: exp.payment_method,
      expense_date: exp.expense_date,
    });
  };

  const saveEdit = () => {
    onEdit(editingId, editForm);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '20px' }}>
        <div className="loading-center">
          <div className="spinner" />
          <span>Loading expenses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(239, 68, 68, 0.08)',
          borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <span style={{ fontSize: '0.8125rem', color: '#f87171', fontWeight: '500' }}>
            {selectedIds.length} selected
          </span>
          <button className="btn btn-danger btn-sm" onClick={() => onBulkDelete(selectedIds)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete Selected
          </button>
        </div>
      )}

      <div style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                />
              </th>
              <th>ID</th>
              <th>User</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th>Description</th>
              <th>Payment</th>
              <th>Date</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-state">
                  <h3>No expenses found</h3>
                  <p>Try adjusting your filters.</p>
                </td>
              </tr>
            ) : (
              expenses.map((exp) => {
                const isEditing = editingId === exp.expense_id;
                return (
                  <tr key={exp.expense_id} style={{ background: isEditing ? 'rgba(16, 185, 129, 0.04)' : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(exp.expense_id)}
                        onChange={() => onSelectToggle(exp.expense_id)}
                      />
                    </td>
                    <td>
                      <span className="badge badge-slate">#{exp.expense_id}</span>
                    </td>
                    <td style={{ maxWidth: '120px' }} className="truncate" title={exp.user_email}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.8125rem' }}>{exp.user_name}</div>
                    </td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editForm.category_id}
                          onChange={(e) => setEditForm({ ...editForm, category_id: parseInt(e.target.value) })}
                          style={{ width: '120px' }}
                        >
                          {categories.map(c => (
                            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="badge badge-emerald">{exp.category_name}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                          style={{ width: '100px', textAlign: 'right' }}
                        />
                      ) : (
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          ₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td style={{ maxWidth: '150px' }} className="truncate">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          style={{ width: '140px' }}
                        />
                      ) : (
                        exp.description || '—'
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editForm.payment_method}
                          onChange={(e) => setEditForm({ ...editForm, payment_method: e.target.value })}
                          style={{ width: '120px' }}
                        >
                          {['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Net Banking'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="badge badge-blue">{exp.payment_method}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editForm.expense_date}
                          onChange={(e) => setEditForm({ ...editForm, expense_date: e.target.value })}
                          style={{ width: '130px' }}
                        />
                      ) : (
                        exp.expense_date
                          ? new Date(exp.expense_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        {isEditing ? (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                            <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-icon" title="Edit" onClick={() => startEditing(exp)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              className="btn-icon"
                              title="Delete"
                              onClick={() => onDelete(exp.expense_id)}
                              style={{ color: 'var(--danger)' }}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
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
  );
}
