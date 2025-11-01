/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A84FF',
        secondary: '#5AC8FA',
        accent: '#FF375F',
        backgroundGlass: 'rgba(255, 255, 255, 0.15)',
        backgroundGlassDark: 'rgba(0, 0, 0, 0.25)'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      screens: {
        '3xl': '1920px'
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.glass-effect': {
          'background-color': 'rgba(255, 255, 255, 0.15)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border-radius': '16px',
          'border': '1px solid rgba(255, 255, 255, 0.3)'
        },
        '.glass-effect-dark': {
          'background-color': 'rgba(0, 0, 0, 0.25)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border-radius': '16px',
          'border': '1px solid rgba(255, 255, 255, 0.1)'
        }
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ]
};
