/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        charcoal: '#0a0a0a',
        graphite: '#111111',
        silver: '#f5f5f5',
        'silver-muted': '#a1a1aa',
        'glass-border': 'rgba(245, 245, 245, 0.08)',
        'glass-fill': 'rgba(17, 17, 17, 0.75)',
        'glass-highlight': 'rgba(245, 245, 245, 0.12)',
      },
      fontFamily: {
        display: ['"Hanken Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px rgba(0, 0, 0, 0.5)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
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
