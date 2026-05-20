import api from '../api/axios'

export const getCategories = async () => {
  const response = await api.get('/categories/')
  return response.data
}

export const addCategory = async (payload) => {
  const response = await api.post('/categories/add', payload)
  return response.data
}
