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
      'inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-5 py-3 text-sm font-semibold text-silver hover:border-glass-border',
  }

  return (
    <button type={type} className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
