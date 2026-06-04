import api from '../api/axios'

export const getCategories = async () => {
  const response = await api.get('/categories/')
  return response.data
}

export const addCategory = async (payload) => {
  const categoryName = payload?.category_name ?? payload?.name
  const response = await api.post('/categories/add', {
    category_name: categoryName,
  })
  return response.data
}
