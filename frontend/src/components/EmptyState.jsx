const EmptyState = ({ title, description }) => (
  <div className="glass-card glass-highlight flex flex-col items-center gap-2 p-8 text-center">
    <p className="text-sm uppercase tracking-[0.22em] text-silver-muted">{title}</p>
    <p className="text-base text-silver">{description}</p>
  </div>
)

export default EmptyState
