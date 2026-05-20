import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import ChartCard from '../components/ChartCard'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import {
  getCategoryBreakdown,
  getMonthlyTrend,
  getOverview,
} from '../services/analyticsService'
import { formatCurrency } from '../utils/format'

const palette = ['#0066ff', '#7000ff', '#b3c5ff', '#d1bcff', '#c6c6c6']

const Analytics = () => {
  const [breakdown, setBreakdown] = useState([])
  const [trend, setTrend] = useState([])
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [breakdownData, trendData, overviewData] = await Promise.all([
          getCategoryBreakdown(),
          getMonthlyTrend(),
          getOverview(),
        ])
        setBreakdown(breakdownData ?? [])
        setTrend(trendData ?? [])
        setOverview(overviewData)
      } catch (err) {
        setError(err?.response?.data?.detail ?? err.message ?? 'Failed to load analytics.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">Insights</p>
        <h1 className="mt-2 text-3xl font-semibold">Analytics Command Center</h1>
      </div>

      {error && <EmptyState title="Analytics Error" description={error} />}

      {loading ? (
        <Loader label="Syncing analytics" />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card glass-highlight p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">
                Total Spend
              </p>
              <p className="mt-3 text-2xl font-semibold text-silver">
                {formatCurrency(overview?.total_expense ?? 0)}
              </p>
            </div>
            <div className="glass-card glass-highlight p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">
                Total Transactions
              </p>
              <p className="mt-3 text-2xl font-semibold text-silver">
                {overview?.total_transactions ?? 0}
              </p>
            </div>
            <div className="glass-card glass-highlight p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">
                Active Categories
              </p>
              <p className="mt-3 text-2xl font-semibold text-silver">{breakdown.length}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Category Spend">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdown}>
                    <XAxis dataKey="category" stroke="#8c90a1" />
                    <YAxis stroke="#8c90a1" />
                    <Tooltip
                      contentStyle={{
                        background: '#131313',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#e2e2e2',
                      }}
                    />
                    <Bar dataKey="amount" fill="#0066ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Monthly Trend">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <XAxis dataKey="month" stroke="#8c90a1" />
                    <YAxis stroke="#8c90a1" />
                    <Tooltip
                      contentStyle={{
                        background: '#131313',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#e2e2e2',
                      }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#7000ff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Expense Distribution">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown.map((item) => ({
                      name: item.category ?? item.name,
                      value: item.amount ?? item.value,
                    }))}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={110}
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
        </>
      )}
    </div>
  )
}

export default Analytics
