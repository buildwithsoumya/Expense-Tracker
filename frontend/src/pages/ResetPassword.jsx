import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'
import api from '../api/axios'

// ── OTP digit input boxes ──────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const inputs = useRef([])
  const digits = value.split('')

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = [...digits]
      if (next[idx]) {
        next[idx] = ''
        onChange(next.join(''))
      } else if (idx > 0) {
        next[idx - 1] = ''
        onChange(next.join(''))
        inputs.current[idx - 1]?.focus()
      }
      return
    }

    if (e.key === 'ArrowLeft' && idx > 0) {
      inputs.current[idx - 1]?.focus()
      return
    }
    if (e.key === 'ArrowRight' && idx < 5) {
      inputs.current[idx + 1]?.focus()
      return
    }
  }

  const handleChange = (e, idx) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) return

    // Handle paste of full OTP
    if (raw.length > 1) {
      const pasted = raw.slice(0, 6).padEnd(6, '')
      onChange(pasted)
      inputs.current[Math.min(5, raw.length - 1)]?.focus()
      return
    }

    const next = [...digits]
    next[idx] = raw[0]
    onChange(next.join(''))
    if (idx < 5) inputs.current[idx + 1]?.focus()
  }

  return (
    <div className="flex gap-3 justify-center my-6">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={6} // allows paste
          value={digits[i] ?? ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onFocus={(e) => e.target.select()}
          className={`
            h-14 w-11 rounded-lg border text-center text-xl font-bold tracking-widest
            bg-[rgba(255,255,255,0.04)] text-silver outline-none
            transition-all duration-200
            ${digits[i]
              ? 'border-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
              : 'border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.25)]'
            }
            focus:border-white focus:shadow-[0_0_16px_rgba(255,255,255,0.2)]
          `}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [email, setEmail] = useState(location.state?.email ?? '')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  // Resend OTP
  const [resendStatus, setResendStatus] = useState('idle') // idle | sending | sent
  const [resendCooldown, setResendCooldown] = useState(0)

  const startCooldown = () => {
    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return
    setResendStatus('sending')
    try {
      await api.post('/auth/forgot-password', { email })
      setResendStatus('sent')
      startCooldown()
      setTimeout(() => setResendStatus('idle'), 3000)
    } catch {
      setResendStatus('idle')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (otp.replace(/\s/g, '').length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.')
      return
    }
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setStatus('loading')
    try {
      await api.post('/auth/reset-password', {
        email,
        otp: otp.replace(/\s/g, ''),
        new_password: newPassword,
      })
      setStatus('success')
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.detail ?? 'Something went wrong. Please try again.'
      )
      setStatus('error')
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
          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >

                <p className="text-2xl font-bold uppercase tracking-[0.25em] text-silver">
                  Reset Password
                </p>
                <p className="mt-3 text-sm text-silver-muted">
                  Enter the 6-digit OTP sent to your email and choose a new password.
                </p>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                  {/* Email — editable in case user navigated directly */}
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  {/* OTP boxes */}
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-silver-muted mb-1">
                      OTP Code
                    </span>
                    <OtpInput value={otp} onChange={setOtp} />

                    {/* Resend link */}
                    <div className="text-center text-xs text-silver-muted">
                      Didn&apos;t receive it?{' '}
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || resendStatus === 'sending'}
                        className={`font-semibold transition-colors ${
                          resendCooldown > 0 || resendStatus === 'sending'
                            ? 'text-silver-muted cursor-not-allowed'
                            : 'text-silver hover:text-white cursor-pointer'
                        }`}
                      >
                        {resendStatus === 'sending'
                          ? 'Sending…'
                          : resendStatus === 'sent'
                          ? '✓ OTP resent!'
                          : resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : 'Resend OTP'}
                      </button>
                    </div>
                  </div>

                  <Input
                    label="New Password"
                    type="password"
                    name="new_password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirm_password"
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  {/* Password strength hint */}
                  {newPassword.length > 0 && (
                    <PasswordStrength password={newPassword} />
                  )}

                  {(status === 'error' || errorMsg) && (
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
                    {status === 'loading' ? 'Resetting…' : 'Reset Password'}
                  </Button>

                  <p className="text-center text-sm text-silver-muted">
                    <Link
                      to="/login"
                      className="font-semibold text-silver hover:text-white"
                    >
                      ← Back to Sign In
                    </Link>
                  </p>
                </form>
              </motion.div>
            ) : (
              /* ── Success ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-4"
              >
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                <p className="text-xl font-bold uppercase tracking-[0.2em] text-silver">
                  Password Reset!
                </p>
                <p className="mt-3 max-w-sm text-sm text-silver-muted leading-relaxed">
                  Your password has been updated successfully. You can now sign in
                  with your new credentials.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/login', { replace: true })}
                  className="mt-8 w-full"
                >
                  <Button className="w-full btn-slide">Go to Sign In</Button>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

// ── Password strength indicator ────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Symbol', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length

  const bar = [
    { w: '25%', color: 'bg-red-500' },
    { w: '50%', color: 'bg-orange-400' },
    { w: '75%', color: 'bg-yellow-400' },
    { w: '100%', color: 'bg-[#48cfad]' },
  ][score - 1] ?? { w: '0%', color: '' }

  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][score]

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="h-1 w-full rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${bar.color}`}
          animate={{ width: bar.w }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {/* Checks + label */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((c) => (
            <span
              key={c.label}
              className={`text-[10px] font-medium transition-colors ${
                c.pass ? 'text-[#48cfad]' : 'text-silver-muted opacity-50'
              }`}
            >
              {c.pass ? '✓' : '○'} {c.label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-semibold ${bar.color.replace('bg-', 'text-').replace('[', '[')}`}>
          {label}
        </span>
      </div>
    </div>
  )
}

export default ResetPassword
