import { useEffect, useState } from 'react'
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
import {
  getOverview,
  getCategoryBreakdown,
  getMonthlyTrend,
  getTopCategory,
  getRecentTransactions,
} from '../services/analyticsService'
import { formatCurrency, formatDate } from '../utils/format'

const palette = ['#0066ff', '#7000ff', '#b3c5ff', '#d1bcff', '#c6c6c6']

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [breakdown, setBreakdown] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [topCategory, setTopCategory] = useState(null)
  const [recent, setRecent] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
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
        setError(err?.response?.data?.detail ?? err.message ?? 'Failed to load analytics.')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">
            AI Expense Command
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Financial Overview</h1>
        </div>
        <Button>
          <Plus size={16} />
          Quick Add Expense
        </Button>
      </div>

      {error ? (
        <EmptyState title="Analytics Offline" description={error} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard
              title="Total Spend"
              value={formatCurrency(overview?.total_expense ?? 0)}
              subtitle="All time"
              icon={<Wallet size={18} />}
            />
            <DashboardCard
              title="Transactions"
              value={overview?.total_transactions ?? 0}
              subtitle="Verified spend"
              icon={<CreditCard size={18} />}
            />
            <DashboardCard
              title="Top Category"
              value={topCategory?.category ?? '—'}
              subtitle={formatCurrency(topCategory?.amount ?? 0)}
              icon={<TrendingUp size={18} />}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ChartCard title="Monthly Overview">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <XAxis dataKey="month" stroke="#8c90a1" />
                    <YAxis stroke="#8c90a1" />
                    <Tooltip
                      contentStyle={{
                        background: '#131313',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#e2e2e2',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#0066ff"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Category Breakdown">
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
                        background: '#131313',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#e2e2e2',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <ChartCard title="Recent Transactions">
              <div className="space-y-4">
                {recent.length === 0 ? (
                  <p className="text-sm text-silver-muted">No recent transactions.</p>
                ) : (
                  recent.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-glass-border px-4 py-3"
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

            <div className="glass-card glass-highlight flex h-full flex-col justify-between p-6">
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
              <div className="mt-6 flex items-center gap-2 text-sm text-electric-blue">
                <Sparkles size={16} />
                Syncing AI insights
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
