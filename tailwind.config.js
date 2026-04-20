export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slateblue: '#0f172a',
        ember: '#f97316',
        skyline: '#0ea5e9',
        moss: '#16a34a',
        rose: '#fb7185'
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif']
      },
      boxShadow: {
        panel: '0 10px 30px rgba(15, 23, 42, 0.12)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-up': 'fadeUp 420ms ease-out',
        'pop-in': 'popIn 300ms ease-out'
      }
    }
  },
  plugins: []
}
