import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Attach admin secret to every request
api.interceptors.request.use((config) => {
  const secret = sessionStorage.getItem('adminSecret') || import.meta.env.VITE_ADMIN_SECRET;
  if (secret) {
    config.headers['x-admin-secret'] = secret;
  }
  return config;
});

// ── Users ──────────────────────────────────────────────────
export const getUsers = (page = 1, limit = 20) =>
  api.get('/admin/users', { params: { page, limit } });

export const getUserExpenses = (userId) =>
  api.get(`/admin/users/${userId}/expenses`);

export const updateUser = (userId, data) =>
  api.put(`/admin/users/${userId}`, data);

export const deleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`);

// ── Expenses ───────────────────────────────────────────────
export const getExpenses = (params = {}) =>
  api.get('/admin/expenses', { params });

export const updateExpense = (expenseId, data) =>
  api.put(`/admin/expenses/${expenseId}`, data);

export const deleteExpense = (expenseId) =>
  api.delete(`/admin/expenses/${expenseId}`);

export const bulkDeleteExpenses = (ids) =>
  api.post('/admin/expenses/bulk-delete', { ids });

export const exportExpensesCSV = (params = {}) =>
  api.get('/admin/expenses/export', { params, responseType: 'blob' });

// ── Categories ─────────────────────────────────────────────
export const getCategories = () =>
  api.get('/admin/categories');

// ── Stats ──────────────────────────────────────────────────
export const getStats = () =>
  api.get('/admin/stats');

// ── DB Operations ──────────────────────────────────────────
export const runDBScript = (script) =>
  api.post('/admin/db/run-script', { script });

export const clearUserData = (userId) =>
  api.delete(`/admin/db/clear-user/${userId}`);

// ── Raw Data Explorer ──────────────────────────────────────
export const patchField = (table, recordId, field, value) =>
  api.post('/admin/patch-field', { table, record_id: recordId, field, value });

export default api;
