const Input = ({ label, error, className = '', ...props }) => (
  <label className="flex flex-col gap-2 text-sm text-silver-muted">
    {label && <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>}
    <input className={`input-field ${className}`} {...props} />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </label>
)

export default Input
