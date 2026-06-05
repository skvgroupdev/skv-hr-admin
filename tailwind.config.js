/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D2B6B',
          hover: '#0A2156',
          light: '#E8EDF7',
        },
        employee: {
          primary:     '#1A3A6B',
          primaryDark: '#0F2347',
          accent:      '#3B82F6',
          accentGlow:  '#60A5FA',
          surface:     '#FFFFFF',
          bg:          '#F0F4FF',
          success:     '#10B981',
          warning:     '#F59E0B',
          danger:      '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Noto Sans Lao', 'Noto Sans', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}
