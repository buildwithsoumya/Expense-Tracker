import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../components/Input'
import Button from '../components/Button'
import useAuth from '../hooks/useAuth'

const Register = () => {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail ?? err.message ?? 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink text-silver">
      <div className="pointer-events-none fixed inset-0 bg-radial-blue opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-radial-purple opacity-60" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10">
        <motion.div
          className="glass-panel glass-highlight w-full max-w-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">Get started</p>
          <h1 className="mt-2 text-3xl font-semibold">Create your Expense Vault</h1>
          <p className="mt-2 text-sm text-silver-muted">
            Join the premium AI finance network.
          </p>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Ava Sterling"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="ava@vault.ai"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="mt-6 text-sm text-silver-muted">
            Already have access?{' '}
            <Link to="/login" className="text-electric-blue hover:text-white">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
