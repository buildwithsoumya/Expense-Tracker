import { useCallback, useEffect, useState } from 'react'
import {
  TrendingUp,
  CreditCard,
  Sparkles,
  Wallet,
  Plus,
} from 'lucide-react'
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import DashboardCard from '../components/DashboardCard'
import ChartCard from '../components/ChartCard'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import Input from '../components/Input'
import {
  getOverview,
  getCategoryBreakdown,
  getMonthlyTrend,
  getTopCategory,
  getRecentTransactions,
} from '../services/analyticsService'
import { addExpense } from '../services/expenseService'
import { formatCurrency, formatDate } from '../utils/format'

const palette = ['#f5f5f5', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b']

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [breakdown, setBreakdown] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [topCategory, setTopCategory] = useState(null)
  const [recent, setRecent] = useState([])
  const [error, setError] = useState('')
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickAddForm, setQuickAddForm] = useState({
    title: '',
    amount: '',
    category_id: '',
    payment_method: '',
    expense_date: '',
  })
  const [quickAddError, setQuickAddError] = useState('')
  const [quickAddLoading, setQuickAddLoading] = useState(false)

  const getErrorMessage = (err, fallback) => {
    const detail = err?.response?.data?.detail
    if (Array.isArray(detail)) {
      return detail.map((item) => item?.msg ?? item?.message ?? String(item)).join(', ')
    }
    if (typeof detail === 'string') return detail
    if (detail) return JSON.stringify(detail)
    return err?.message ?? fallback
  }

  const fetchData = useCallback(async () => {
    setError('')
    try {
      const [
        overviewData,
        breakdownData,
        trendData,
        topData,
        recentData,
      ] = await Promise.all([
        getOverview(),
        getCategoryBreakdown(),
        getMonthlyTrend(),
        getTopCategory(),
        getRecentTransactions(),
      ])
      setOverview(overviewData)
      setBreakdown(breakdownData ?? [])
      setMonthlyTrend(trendData ?? [])
      setTopCategory(topData)
      setRecent(recentData ?? [])
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load analytics.'))
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  const handleQuickAddChange = (event) => {
    setQuickAddForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleQuickAddSubmit = async (event) => {
    event.preventDefault()
    setQuickAddError('')
    setQuickAddLoading(true)
    try {
      await addExpense(quickAddForm)
      setQuickAddOpen(false)
      setQuickAddForm({
        title: '',
        amount: '',
        category_id: '',
        payment_method: '',
        expense_date: '',
      })
      await fetchData()
    } catch (err) {
      setQuickAddError(getErrorMessage(err, 'Failed to add expense.'))
    } finally {
      setQuickAddLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          
          <h1 className="mt-2 text-3xl font-semibold">My Finances</h1>
        </div>
        <Button onClick={() => setQuickAddOpen(true)} className="whitespace-nowrap btn-slide">
          <span className="flex items-center gap-2">
            <Plus size={16} />
            Add Expense
          </span>
        </Button>
      </div>

      {error ? (
        <EmptyState title="Analytics Offline" description={error} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard
              className="rounded-none"
              title="Total Spend"
              value={formatCurrency(overview?.total_expense ?? 0)}
              subtitle="All time"
              icon={<Wallet size={18} />}
            />
            <DashboardCard
              className="rounded-none"
              title="Transactions"
              value={overview?.total_transactions ?? 0}
              subtitle="Verified spend"
              icon={<CreditCard size={18} />}
            />
            <DashboardCard
              className="rounded-none"
              title="Top Category"
              value={topCategory?.category ?? '—'}
              subtitle={formatCurrency(topCategory?.amount ?? 0)}
              icon={<TrendingUp size={18} />}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ChartCard title="Monthly Overview" className="rounded-none">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <XAxis dataKey="month" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        background: '#111111',
                        border: '1px solid rgba(245,245,245,0.12)',
                        color: '#f5f5f5',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#f5f5f5"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Category Breakdown" className="rounded-none">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown.map((item) => ({
                        name: item.category ?? item.name,
                        value: item.amount ?? item.value,
                      }))}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                    >
                      {breakdown.map((_, index) => (
                        <Cell key={index} fill={palette[index % palette.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#111111',
                        border: '1px solid rgba(245,245,245,0.12)',
                        color: '#f5f5f5',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <ChartCard title="Recent Transactions" className="rounded-none">
              <div className="space-y-4">
                {recent.length === 0 ? (
                  <p className="text-sm text-silver-muted">No recent transactions.</p>
                ) : (
                  recent.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border border-glass-border bg-graphite/50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-silver">
                          {item.title ?? item.description}
                        </p>
                        <p className="text-xs text-silver-muted">
                          {item.category} • {formatDate(item.date)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-silver">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ChartCard>

            <div className="glass-card flex h-full flex-col justify-between p-6 rounded-none">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">
                  AI Insights
                </p>
                <h3 className="mt-3 text-xl font-semibold text-silver">
                  Your smart spending assistant
                </h3>
                <p className="mt-3 text-sm text-silver-muted">
                  Personalized insights and anomaly detection will surface here once
                  more activity is logged.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        title="Quick Add Expense"
      >
        <form className="space-y-4" onSubmit={handleQuickAddSubmit}>
          <Input
            label="Title"
            name="title"
            placeholder="Coffee at Celeste"
            value={quickAddForm.title}
            onChange={handleQuickAddChange}
            required
          />
          <Input
            label="Amount"
            type="number"
            name="amount"
            placeholder="420"
            value={quickAddForm.amount}
            onChange={handleQuickAddChange}
            required
          />
          <Input
            label="Category ID"
            name="category_id"
            placeholder="1"
            value={quickAddForm.category_id}
            onChange={handleQuickAddChange}
            required
          />
          <Input
            label="Payment Method"
            name="payment_method"
            placeholder="Card"
            value={quickAddForm.payment_method}
            onChange={handleQuickAddChange}
          />
          <Input
            label="Expense Date"
            type="date"
            name="expense_date"
            value={quickAddForm.expense_date}
            onChange={handleQuickAddChange}
            required
          />
          {quickAddError && <p className="text-sm text-red-300">{quickAddError}</p>}
          <Button type="submit" className="w-full btn-slide" disabled={quickAddLoading}>
            {quickAddLoading ? 'Adding expense...' : 'Add Expense'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}

export default Dashboard
