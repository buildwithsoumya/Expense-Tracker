import api from '../api/axios'

export const getOverview = async () => {
  const response = await api.get('/analytics/overview')
  return response.data
}

export const getCategoryBreakdown = async () => {
  const response = await api.get('/analytics/category-breakdown')
  return response.data
}

export const getMonthlyTrend = async () => {
  const response = await api.get('/analytics/monthly-trend')
  return response.data
}

export const getTopCategory = async () => {
  const response = await api.get('/analytics/top-category')
  return response.data
}

export const getRecentTransactions = async () => {
  const response = await api.get('/analytics/recent-transactions')
  return response.data
}
