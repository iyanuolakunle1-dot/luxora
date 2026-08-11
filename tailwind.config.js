/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        luxora: {
          bg: '#0a0c10',
          surface: '#0f1218',
          card: '#131722',
          border: '#1f2430',
          gold: '#e0a83c',
          'gold-light': '#f4c869',
          'gold-dark': '#b9821f',
          purple: '#7c5cfc',
          text: '#e7e9ee',
          muted: '#8b92a3',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(224,168,60,0.15), 0 8px 24px -8px rgba(224,168,60,0.25)',
        card: '0 4px 20px -4px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg,#f4c869 0%,#e0a83c 50%,#b9821f 100%)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-500px 0' }, '100%': { backgroundPosition: '500px 0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
