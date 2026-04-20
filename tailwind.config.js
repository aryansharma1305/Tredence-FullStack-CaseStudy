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
      }
    }
  },
  plugins: []
}
