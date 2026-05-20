import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import Button from '../components/Button'

const Landing = () => (
  <div className="min-h-screen bg-ink text-silver">
    <div className="pointer-events-none fixed inset-0 bg-radial-blue opacity-70" />
    <div className="pointer-events-none fixed inset-0 bg-radial-purple opacity-70" />
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-electric-blue to-deep-purple text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">SmartSpend AI</p>
            <p className="text-lg font-semibold">Vault</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-secondary">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary">
            Create Account
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center gap-10 py-16">
        <div className="max-w-3xl space-y-6">
          <p className="tag w-fit">Premium AI Finance</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Command your spending with a vault-grade AI expense cockpit.
          </h1>
          <p className="text-lg text-silver-muted">
            Experience CRED-inspired clarity, automated insights, and category intelligence
            across every transaction. Built for modern fintech teams and ambitious
            professionals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <Button>
                Enter the Vault <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">I already have access</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'AI-Powered Insights',
              description: 'Predictive alerts highlight anomalies and optimize budgets.',
            },
            {
              title: 'Glassmorphism UX',
              description: 'Premium dark visuals tuned for clarity and confidence.',
            },
            {
              title: 'Live Analytics',
              description: 'Realtime charts surface spend trends and category shifts.',
            },
          ].map((card) => (
            <div key={card.title} className="glass-card glass-highlight p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-silver-muted">
                {card.title}
              </p>
              <p className="mt-3 text-base text-silver">{card.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
)

export default Landing
