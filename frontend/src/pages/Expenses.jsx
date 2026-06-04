import { useEffect, useMemo, useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Modal from '../components/Modal'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import ExpenseTable from '../components/ExpenseTable'
import ExpenseCard from '../components/ExpenseCard'
import {
  addExpense,
  deleteExpense,
  filterExpenses,
  getExpenses,
  updateExpense,
} from '../services/expenseService'
import { getCategories } from '../services/categoryService'

const defaultForm = {
  title: '',
  amount: '',
  category_id: '',
  payment_method: '',
  expense_date: '',
}

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [categoryError, setCategoryError] = useState('')
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    payment: '',
    startDate: '',
    endDate: '',
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(defaultForm)

  const fetchExpenses = async (params) => {
    try {
      const data = params ? await filterExpenses(params) : await getExpenses()
      setExpenses(data ?? [])
      setError('')
    } catch (err) {
      setError(err?.response?.data?.detail ?? err.message ?? 'Failed to load expenses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExpenses()
  }, [])

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const data = await getCategories()
      setCategories(data ?? [])
      setCategoryError('')
    } catch (err) {
      setCategoryError(
        err?.response?.data?.detail ?? err.message ?? 'Failed to load categories.',
      )
    } finally {
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories()
  }, [])

  useEffect(() => {
    if (modalOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCategories()
    }
  }, [modalOpen])

  const visibleCategories = useMemo(() => {
    const seen = new Set()
    return categories.filter((category) => {
      const categoryName = (category.category_name ?? category.name ?? category.title ?? '').trim()
      const key = categoryName.toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [categories])

  const categoriesById = useMemo(() => {
    const map = new Map()
    visibleCategories.forEach((category) => {
      const categoryId = category.category_id ?? category.id
      const categoryName = category.category_name ?? category.name ?? category.title
      if (categoryId !== undefined && categoryName) {
        map.set(Number(categoryId), categoryName)
      }
    })
    return map
  }, [visibleCategories])

  const displayExpenses = useMemo(
    () =>
      expenses.map((expense) => {
        const id = expense.id ?? expense.expense_id
        const categoryId = expense.category_id
        const categoryName = Number.isFinite(Number(categoryId))
          ? categoriesById.get(Number(categoryId))
          : undefined
        return {
          ...expense,
          id,
          date: expense.date ?? expense.expense_date,
          category: categoryName ?? expense.category ?? expense.category_name ?? expense.category_id,
        }
      }),
    [categoriesById, expenses],
  )

  const activeFilters = useMemo(
    () => {
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.category) params.category = filters.category
      if (filters.payment) params.payment_method = filters.payment
      if (filters.startDate) params.start_date = filters.startDate
      if (filters.endDate) params.end_date = filters.endDate
      return params
    },
    [filters],
  )

  const handleFilterChange = (event) => {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const applyFilters = () => {
    setLoading(true)
    if (Object.keys(activeFilters).length === 0) {
      fetchExpenses()
    } else {
      fetchExpenses(activeFilters)
    }
  }

  const openAddModal = () => {
    setEditTarget(null)
    setForm(defaultForm)
    setModalOpen(true)
  }

  const openEditModal = (expense) => {
    setEditTarget(expense)
    setForm({
      title: expense.title ?? expense.description ?? '',
      amount: expense.amount ?? '',
      category_id: expense.category_id ?? '',
      payment_method: expense.payment_method ?? '',
      expense_date: expense.expense_date
        ? expense.expense_date.split('T')[0]
        : expense.date
          ? expense.date.split('T')[0]
          : '',
    })
    setModalOpen(true)
  }

  const handleFormChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      if (editTarget) {
        await updateExpense(editTarget.id ?? editTarget.expense_id, form)
      } else {
        await addExpense(form)
      }
      setModalOpen(false)
      fetchExpenses(Object.keys(activeFilters).length ? activeFilters : undefined)
    } catch (err) {
      setError(err?.response?.data?.detail ?? err.message ?? 'Failed to save expense.')
    }
  }

  const handleDelete = async (expense) => {
    try {
      setLoading(true)
      await deleteExpense(expense.id ?? expense.expense_id)
      fetchExpenses(Object.keys(activeFilters).length ? activeFilters : undefined)
    } catch (err) {
      setError(err?.response?.data?.detail ?? err.message ?? 'Failed to delete expense.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">
            Expense History
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Transactions</h1>
        </div>
        <Button onClick={openAddModal}>
          <Plus size={16} />
          Add Expense
        </Button>
      </div>

      <div className="glass-card grid gap-4 p-5 md:grid-cols-6">
        <Input
          label="Search"
          name="search"
          placeholder="Search title"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <Input
          label="Category"
          name="category"
          placeholder="Food, Travel..."
          value={filters.category}
          onChange={handleFilterChange}
        />
        <Input
          label="Payment"
          name="payment"
          placeholder="Card, Cash..."
          value={filters.payment}
          onChange={handleFilterChange}
        />
        <Input
          label="From"
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <Input
          label="To"
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <div className="flex items-end">
          <Button variant="secondary" className="w-full" onClick={applyFilters}>
            <Filter size={16} />
            Apply Filters
          </Button>
        </div>
      </div>

      {error && <EmptyState title="Expense Error" description={error} />}

      {loading ? (
        <Loader label="Loading expenses" />
      ) : displayExpenses.length === 0 ? (
        <EmptyState title="No expenses" description="Start logging your spending." />
      ) : (
        <>
          <div className="hidden md:block">
            <ExpenseTable expenses={displayExpenses} onEdit={openEditModal} onDelete={handleDelete} />
          </div>
          <div className="grid gap-4 md:hidden">
            {displayExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Expense' : 'Add Expense'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Title"
            name="title"
            placeholder="Dinner at Nori"
            value={form.title}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Amount"
            type="number"
            name="amount"
            placeholder="4500"
            value={form.amount}
            onChange={handleFormChange}
            required
          />
          <Select
            label="Category"
            name="category_id"
            value={form.category_id}
            onChange={handleFormChange}
            required
            disabled={categoriesLoading}
          >
            <option value="" disabled>
              {categoriesLoading
                ? 'Loading categories...'
                : categories.length === 0
                  ? 'No categories available'
                  : 'Select category'}
            </option>
            {visibleCategories.map((category) => {
              const categoryId = category.category_id ?? category.id
              const categoryName = category.category_name ?? category.name ?? category.title
              if (categoryId === undefined) return null
              return (
                <option key={categoryId} value={categoryId}>
                  {categoryName ?? `Category ${categoryId}`}
                </option>
              )
            })}
          </Select>
          {categoryError && <p className="text-xs text-red-400">{categoryError}</p>}
          <Select
            label="Payment Method"
            name="payment_method"
            value={form.payment_method}
            onChange={handleFormChange}
          >
            <option value="">Select payment</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Net Banking">Net Banking</option>
          </Select>
          <Input
            label="Expense Date"
            type="date"
            name="expense_date"
            value={form.expense_date}
            onChange={handleFormChange}
            required
          />
          <Button type="submit" className="w-full btn-slide">
            {editTarget ? 'Update Expense' : 'Add Expense'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}

export default Expenses
