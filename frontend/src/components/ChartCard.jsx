const ChartCard = ({ title, children, action }) => (
  <div className="glass-card glass-highlight p-6">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">{title}</p>
      </div>
      {action}
    </div>
    {children}
  </div>
)

export default ChartCard
