import { useCallback, useEffect, useState } from 'react'
import { TrendingUp, CreditCard, Wallet, Calendar } from 'lucide-react'
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
import EmptyState from '../components/EmptyState'
import {
  getOverview,
  getCategoryBreakdown,
  getMonthlyTrend,
  getTopCategory,
  getRecentTransactions,
} from '../services/analyticsService'
import { formatCurrency, formatDate } from '../utils/format'

const palette = ['#f5f5f5', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b']

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [breakdown, setBreakdown] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [topCategory, setTopCategory] = useState(null)
  const [recent, setRecent] = useState([])
  const [error, setError] = useState('')

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
      setBreakdown(
        (breakdownData ?? []).map((item) => ({
          category: item.category ?? item.name,
          amount: item.amount ?? item.total ?? item.value ?? 0,
        })),
      )
      setMonthlyTrend(trendData ?? [])
      setTopCategory({
        category: topData?.category ?? topData?.top_category,
        amount: topData?.amount ?? topData?.total_spent ?? 0,
      })
      setRecent(
        (recentData ?? []).map((item) => ({
          id: item.id ?? item.expense_id,
          title: item.title ?? item.description,
          description: item.description,
          category: item.category ?? item.category_name,
          date: item.date ?? item.expense_date,
          amount: item.amount,
        })),
      )
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load analytics.'))
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          
          <h1 className="mt-2 text-3xl font-semibold">My Finances</h1>
        </div>
      </div>

      {error ? (
        <EmptyState title="Analytics Offline" description={error} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <DashboardCard
              className="rounded-none"
              title="Total Spend"
              value={formatCurrency(overview?.total_expense ?? 0)}
              subtitle="All time"
              icon={<Wallet size={18} />}
            />
            <DashboardCard
              className="rounded-none"
              title="This Month"
              value={formatCurrency(overview?.this_month_expense ?? 0)}
              subtitle="Current month"
              icon={<Calendar size={18} />}
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
                  recent.slice(0, 3).map((item) => (
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

    </div>
  )
}

export default Dashboard
