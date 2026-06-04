import api from '../api/axios'

const normalizeExpensePayload = (payload) => {
  const {
    title,
    description,
    category,
    category_id,
    payment_method,
    date,
    expense_date,
    amount,
    ...rest
  } = payload ?? {}
  const resolvedCategory =
    category_id !== undefined && category_id !== ''
      ? Number(category_id)
      : category !== undefined && category !== ''
        ? Number(category)
        : undefined
  const resolvedAmount =
    amount !== undefined && amount !== '' ? Number(amount) : amount
  const trimmedPayment =
    typeof payment_method === 'string' ? payment_method.trim() : payment_method
  const normalizedPayment =
    typeof trimmedPayment === 'string' && trimmedPayment.toLowerCase() === 'card'
      ? 'Credit Card'
      : trimmedPayment
  return {
    ...rest,
    description: description ?? title ?? '',
    category_id: Number.isFinite(resolvedCategory) ? resolvedCategory : undefined,
    payment_method: normalizedPayment,
    expense_date: expense_date ?? date ?? '',
    amount: Number.isFinite(resolvedAmount) ? resolvedAmount : amount,
  }
}

export const getExpenses = async () => {
  const response = await api.get('/expenses/')
  return response.data
}

export const addExpense = async (payload) => {
  const response = await api.post('/expenses/add', normalizeExpensePayload(payload))
  return response.data
}

export const updateExpense = async (id, payload) => {
  const response = await api.put(
    `/expenses/update/${id}`,
    normalizeExpensePayload(payload),
  )
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
