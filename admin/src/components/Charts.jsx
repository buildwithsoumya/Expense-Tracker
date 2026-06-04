import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
} from 'recharts';

const chartTooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(71, 85, 105, 0.5)',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#f1f5f9',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
};

export function CategoryBreakdownChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="empty-state">
        <h3>No category data</h3>
        <p>Spending data will appear here once transactions exist.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '320px' }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" />
          <XAxis
            dataKey="category"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(71, 85, 105, 0.3)' }}
            tickLine={false}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Amount']}
            cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
          />
          <Bar
            dataKey="amount"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyActivityChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="empty-state">
        <h3>No activity data</h3>
        <p>Daily activity will appear here once transactions exist.</p>
      </div>
    );
  }

  const formatted = data.map(d => ({
    ...d,
    dateLabel: d.date ? new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '',
  }));

  return (
    <div style={{ width: '100%', height: '320px' }}>
      <ResponsiveContainer>
        <AreaChart data={formatted} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(71, 85, 105, 0.3)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value, name) => {
              if (name === 'count') return [value, 'Transactions'];
              return [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Amount'];
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#activityGradient)"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3, fill: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopSpendersTable({ data = [] }) {
  if (!data.length) {
    return (
      <div className="empty-state">
        <h3>No spender data</h3>
        <p>Top spenders will appear here once transactions exist.</p>
      </div>
    );
  }

  return (
    <div style={{ overflow: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th style={{ textAlign: 'right' }}>Total Spent</th>
            <th style={{ textAlign: 'right' }}>Txns</th>
          </tr>
        </thead>
        <tbody>
          {data.map((spender, i) => (
            <tr key={spender.user_id}>
              <td>
                <span className={`badge ${i === 0 ? 'badge-amber' : i === 1 ? 'badge-slate' : 'badge-slate'}`}>
                  {i + 1}
                </span>
              </td>
              <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{spender.name}</td>
              <td>{spender.email}</td>
              <td style={{ textAlign: 'right', fontWeight: '600', color: '#10b981' }}>
                ₹{parseFloat(spender.total_spent).toLocaleString('en-IN')}
              </td>
              <td style={{ textAlign: 'right' }}>{spender.transaction_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
