import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, updateUser, deleteUser } from '../api/adminApi';
import UserTable from '../components/UserTable';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers(page, limit);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      showToast('error', 'Failed to load users: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = async (userId, data) => {
    try {
      await updateUser(userId, data);
      showToast('success', 'User updated successfully');
      fetchUsers();
    } catch (err) {
      showToast('error', 'Failed to update: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      showToast('success', 'User deleted successfully');
      fetchUsers();
    } catch (err) {
      showToast('error', 'Failed to delete: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleViewExpenses = (userId) => {
    navigate(`/expenses?user_id=${userId}`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Users</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Manage registered users · {total} total
          </p>
        </div>
        <button className="btn btn-ghost" onClick={fetchUsers}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      <UserTable
        users={users}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewExpenses={handleViewExpenses}
        loading={loading}
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
