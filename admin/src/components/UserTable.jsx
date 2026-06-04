import { useState } from 'react';
import Modal from './Modal';

export default function UserTable({ users, total, page, limit, onPageChange, onEdit, onDelete, onViewExpenses, loading }) {
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
                  <td colSpan="7" className="empty-state">
                    <h3>No users found</h3>
                    <p>Users will appear here once they register.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id}>
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
                          title="View expenses"
                          onClick={() => onViewExpenses(user.user_id)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
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

      {/* Edit Modal */}
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
