import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import Logo from '../components/Logo'

const Landing = () => (
  <div className="min-h-screen bg-ink text-silver">
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
      <header className="flex items-center justify-between">
        <Logo
          responsive
          className="text-silver"
          markClassName="h-12 w-12"
          wordmarkClassName="text-base md:text-lg"
          singleLineWordmark
          disableHover
        />
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.28em] text-silver-muted md:flex">
          <Link to="/login" className="transition-colors hover:text-silver">
            Sign In
          </Link>
          <Link to="/register" className="transition-colors hover:text-silver">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="relative flex flex-1 flex-col justify-center gap-16 py-16">
        <div className="pointer-events-none absolute right-0 top-10 hidden opacity-[0.04] md:block">
          <Logo
            variant="icon"
            className="text-silver"
            markClassName="h-40 w-40"
            disableHover
          />
        </div>
        <div className="max-w-4xl space-y-8">
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Track spending with clarity.
          </h1>
          <p className="max-w-2xl text-lg text-silver-muted">
            Less clutter. Better financial decisions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <Button className="btn-slide">
                Sign In <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="btn-slide">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-10 border-t border-glass-border pt-12 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-silver-muted">
              Spending Overview
            </p>
            <h2 className="text-2xl font-semibold">Everything in one place.</h2>
            <p className="text-sm text-silver-muted">
              Built to simplify everyday financial tracking.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-silver-muted">
              Expense Management
            </p>
            <h2 className="text-2xl font-semibold">Designed for everyday financial clarity.</h2>
            <p className="text-sm text-silver-muted">
              Built to help you understand your financial habits.
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
)

export default Landing
