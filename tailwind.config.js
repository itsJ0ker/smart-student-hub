module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        night: {
          900: '#050713',
          800: '#0C1024',
          700: '#111836'
        },
        aurora: {
          teal: '#00F5A0',
          blue: '#00D9F5',
          purple: '#7A5AF8'
        }
      },
      boxShadow: {
        glow: '0 20px 45px -20px rgba(45, 212, 191, 0.45)',
        'card-lg': '0 15px 35px -15px rgba(15, 23, 42, 0.35)'
      },
      backgroundImage: {
        'grid-glow': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)'
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
