import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Input from '../components/Input'
import Button from '../components/Button'
import Logo from '../components/Logo'
import api from '../api/axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await api.post('/auth/forgot-password', { email })
      setStatus('sent')
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.detail ?? 'Something went wrong. Please try again.'
      )
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-ink text-silver">
      {/* Top logo */}
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
          <AnimatePresence mode="wait">
            {status !== 'sent' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-2xl font-bold uppercase tracking-[0.25em] text-silver">
                  Forgot Password
                </p>
                <p className="mt-3 text-sm text-silver-muted">
                  Enter your registered email and we&apos;ll send a 6-digit OTP.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  {status === 'error' && (
                    <motion.p
                      className="text-sm text-red-300"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errorMsg}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    className="w-full btn-slide"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Sending OTP…' : 'Send OTP'}
                  </Button>

                  <p className="text-center text-sm text-silver-muted">
                    Remembered it?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-silver hover:text-white"
                    >
                      Back to Sign In
                    </Link>
                  </p>
                </form>
              </motion.div>
            ) : (
              /* Success state */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-4"
              >
                {/* Animated checkmark circle */}
                <motion.div
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(72,207,173,0.12)] border border-[rgba(72,207,173,0.35)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                >
                  <svg
                    className="h-10 w-10 text-[#48cfad]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <p className="text-xl font-bold uppercase tracking-[0.2em] text-silver">
                  OTP Sent!
                </p>
                <p className="mt-3 max-w-sm text-sm text-silver-muted leading-relaxed">
                  A 6-digit code has been sent to{' '}
                  <span className="font-semibold text-silver">{email}</span>.
                  Check your inbox (and spam folder) and enter the code on the
                  next page.
                </p>
                <p className="mt-2 text-xs text-silver-muted opacity-60">
                  The OTP expires in 10 minutes.
                </p>

                <Link
                  to="/reset-password"
                  state={{ email }}
                  className="mt-8 w-full"
                >
                  <Button className="w-full btn-slide">Enter OTP &amp; Reset Password</Button>
                </Link>

                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-sm text-silver-muted hover:text-silver transition-colors"
                >
                  Use a different email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPassword
