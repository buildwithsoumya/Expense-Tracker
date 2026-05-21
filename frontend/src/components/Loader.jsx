const Loader = ({ label = 'Loading' }) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-10 text-silver-muted">
    <div className="h-10 w-10 animate-spin border-2 border-silver/30 border-t-silver" />
    <span className="text-sm uppercase tracking-[0.2em]">{label}</span>
  </div>
)

export default Loader
