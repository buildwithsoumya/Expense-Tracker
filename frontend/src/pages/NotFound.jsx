import { Link } from 'react-router-dom'
import Button from '../components/Button'

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-silver">
    <div className="glass-card max-w-md p-8 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">404</p>
      <h1 className="mt-3 text-2xl font-semibold">This route is outside the vault.</h1>
      <p className="mt-3 text-sm text-silver-muted">
        Return to the dashboard to keep tracking your premium spend.
      </p>
      <Link to="/dashboard" className="mt-6 inline-flex">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  </div>
)

export default NotFound
