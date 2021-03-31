const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...defaultTheme.colors,
      blue: '#27B0E6',
      pink: '#FA52A0',
      purple: '#A755DD',
      background: '#0D0415'
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans',...defaultTheme.fontFamily.sans]
      },
      borderRadius: {
        'none': '0',
        'sm': '0.313',
        DEFAULT: '0.625rem',
      },
      textColor: {
        ...defaultTheme.textColor,
        lowEmphesis: '#575757',
        primary: '#BFBFBF',
        secondary: '#7F7F7F',
        highEmphesis: '#E3E3E3',
      },
      backgroundColor: {
        ...defaultTheme.backgroundColor,
        primary: '#0D0415'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    fontFamily: true,
    preflight: true
  },
  purge: process.env.NODE_ENV !== 'development' ? ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'] : false
}
