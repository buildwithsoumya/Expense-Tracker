/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        charcoal: '#121212',
        surface: '#131313',
        'surface-high': '#2a2a2a',
        silver: '#e2e2e2',
        'silver-muted': '#c2c6d8',
        'electric-blue': '#0066ff',
        'deep-purple': '#7000ff',
        'glass-border': 'rgba(255, 255, 255, 0.12)',
        'glass-fill': 'rgba(18, 18, 18, 0.6)',
        'glass-highlight': 'rgba(255, 255, 255, 0.18)',
      },
      fontFamily: {
        display: ['"Hanken Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(0, 102, 255, 0.2)',
        soft: '0 20px 50px rgba(0, 0, 0, 0.45)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'radial-blue':
          'radial-gradient(circle at 20% 20%, rgba(0, 102, 255, 0.25), transparent 55%)',
        'radial-purple':
          'radial-gradient(circle at 80% 0%, rgba(112, 0, 255, 0.25), transparent 55%)',
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '1.75rem',
      },
      transitionTimingFunction: {
        glass: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
