/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact Soft Glassmorphism Palette
        bgmain: '#E9F0F8',
        bgsecondary: '#F3F7FB',
        textmain: '#0F172A',
        secondary: '#64748B',
        muted: '#94A3B8',
        
        primaryblue: '#2563EB',
        secondaryblue: '#3B82F6',
        darkblue: '#1D4ED8',
        lightblue: '#DBEAFE',
        
        growthgreen: '#10B981',
        teal: '#14B8A6',
        darkgreen: '#047857',
        lightgreen: '#D1FAE5',
        
        cyanaccent: '#06B6D4',
        warningorange: '#F59E0B',
        warningbg: '#FEF3C7',

        // Theme compatibility tokens
        growth: {
          50: '#F0FDF4',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        problue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        borderclr: 'rgba(255, 255, 255, 0.75)',
        borderglass: 'rgba(255, 255, 255, 0.85)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft-glass': '0 8px 30px rgba(30, 60, 90, 0.08)',
        'glass-hover': '0 14px 40px rgba(30, 60, 90, 0.12)',
        'glass-panel': '0 10px 35px rgba(30, 60, 90, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '18px',
      },
    },
  },
  plugins: [],
}
