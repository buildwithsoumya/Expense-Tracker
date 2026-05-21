const Button = ({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost:
      'inline-flex items-center justify-center gap-2 border border-transparent px-5 py-3 text-sm font-semibold text-silver-muted hover:border-glass-border hover:text-silver',
  }

  return (
    <button type={type} className={`${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
}

export default Button
