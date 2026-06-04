import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../components/Input'
import Button from '../components/Button'
import useAuth from '../hooks/useAuth'
import Logo from '../components/Logo'

const Register = () => {
  const { register, login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
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
      const data = await register(form)
      const token = data?.access_token ?? data?.token ?? data?.jwt
      if (!token) {
        await login({ email: form.email, password: form.password })
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail ?? err.message ?? 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink text-silver">
      <div className="relative mx-auto max-w-6xl px-2 pt-6">
        <Logo
          variant="compact"
          className="text-silver -ml-3"
          markClassName="h-10 w-10"
          wordmarkClassName="text-lg"
        />
      </div>
      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-6 py-10">
        <motion.div
          className="glass-panel w-full max-w-xl rounded-none px-10 py-14 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-2xl font-bold uppercase tracking-[0.25em] text-silver">
            Create account
          </p>
          <p className="mt-3 text-sm text-silver-muted">
            Join SmartSpend AI to start tracking smarter.
          </p>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              name="full_name"
              placeholder="Ava Sterling"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="ava@smartspend.ai"
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
            <Button type="submit" className="w-full btn-slide" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-center text-sm text-silver-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-silver hover:text-white">
                Sign in.
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
