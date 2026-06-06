import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LogoMark = ({ className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    role="img"
    aria-label="SmartSpend AI"
    className={className}
    fill="none"
  >
    <rect x="4" y="4" width="40" height="40" stroke="currentColor" strokeWidth="1.5" />
    <text
      x="24"
      y="30"
      textAnchor="middle"
      fontSize="18"
      fontWeight="700"
      letterSpacing="1"
      fill="currentColor"
      fontFamily="Hanken Grotesk, Inter, system-ui, sans-serif"
    >
      SS
    </text>
  </svg>
)

const Wordmark = ({ className = '', singleLine = false }) =>
  singleLine ? (
    <span className={`whitespace-nowrap text-base font-semibold tracking-[0.3em] ${className}`}>
      <span className="text-silver">SMARTSPEND</span>
      <span className="text-silver-muted"> AI</span>
    </span>
  ) : (
    <div className={`flex flex-col ${className}`}>
      <span className="text-sm uppercase tracking-[0.35em] text-silver-muted">
        SmartSpend
      </span>
      <span className="text-base font-semibold tracking-[0.35em] text-silver">AI</span>
    </div>
  )

const Logo = ({
  variant = 'full',
  responsive = false,
  className = '',
  markClassName = '',
  wordmarkClassName = '',
  singleLineWordmark = false,
  disableHover = false,
}) => {
  const Wrapper = motion.div
  const base = 'flex items-center gap-3 text-silver'

  const variants = {
    full: (
      <div className={base}>
        <LogoMark className={`h-10 w-10 ${markClassName}`} />
        <Wordmark className={wordmarkClassName} singleLine={singleLineWordmark} />
      </div>
    ),
    compact: (
      <div className={`${base} gap-2`}>
        <LogoMark className={`h-8 w-8 ${markClassName}`} />
        <span
          className={`whitespace-nowrap text-base font-semibold tracking-[0.3em] ${wordmarkClassName}`}
        >
          <span className="text-silver">SMARTSPEND</span>
          <span className="text-silver-muted"> AI</span>
        </span>
      </div>
    ),
    icon: <LogoMark className={`h-9 w-9 ${markClassName}`} />,
  }

  return (
    <Link to="/" className="cursor-pointer">
      <Wrapper
        className={className}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={disableHover ? undefined : { opacity: 0.8 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {responsive ? (
          <>
            <div className="hidden lg:flex">{variants.full}</div>
            <div className="hidden sm:flex lg:hidden">{variants.compact}</div>
            <div className="flex sm:hidden">{variants.icon}</div>
          </>
        ) : (
          variants[variant]
        )}
      </Wrapper>
    </Link>
  )
}

export default Logo
