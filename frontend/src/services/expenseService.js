import api from '../api/axios'

export const getExpenses = async () => {
  const response = await api.get('/expenses/')
  return response.data
}

export const addExpense = async (payload) => {
  const response = await api.post('/expenses/add', payload)
  return response.data
}

export const updateExpense = async (id, payload) => {
  const response = await api.put(`/expenses/update/${id}`, payload)
  return response.data
}

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/delete/${id}`)
  return response.data
}

export const filterExpenses = async (params) => {
  const response = await api.get('/expenses/filter', { params })
  return response.data
}
