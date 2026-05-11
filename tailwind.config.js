/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080810',
        surface: '#0F0F1E',
        card: '#161627',
        border: '#1E1E35',
        primary: { DEFAULT: '#7C3AED', light: '#9D65F5', dark: '#5B21B6' },
        secondary: { DEFAULT: '#2563EB', light: '#3B82F6' },
        gold: { DEFAULT: '#F59E0B', light: '#FCD34D' },
        success: '#10B981',
        danger: '#EF4444',
        muted: '#64748B',
        textbase: '#F1F5F9',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

