/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#0B0B0B',
          soft: '#1A1A1A',
        },
        crimson: {
          DEFAULT: '#B3001B',
          light: '#E63946',
        },
        surface: '#F5F5F5',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'ring-glow':
          'radial-gradient(circle at 65% 35%, rgba(230,57,70,0.28) 0%, rgba(179,0,27,0.08) 35%, transparent 65%)',
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45)',
        'glow-crimson': '0 0 40px rgba(230,57,70,0.35)',
        'glow-crimson-lg': '0 0 80px rgba(230,57,70,0.25)',
      },
      clipPath: {
        cta: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
      },
      keyframes: {
        'ring-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: 0.6 },
          '70%': { transform: 'scale(1.25)', opacity: 0 },
          '100%': { transform: 'scale(1.25)', opacity: 0 },
        },
      },
      animation: {
        'ring-spin-slow': 'ring-spin 40s linear infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
};
