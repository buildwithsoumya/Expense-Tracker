const ChartCard = ({ title, children, action, className = '' }) => (
  <div className={`glass-card p-6 ${className}`}>
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
