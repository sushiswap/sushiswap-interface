const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: false, // or 'media' or 'class'
  important: true,
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
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans]
      },
      borderRadius: {
        'none': '0',
        'sm': '0.313rem',
        DEFAULT: '0.625rem'
      },
      textColor: {
        ...defaultTheme.textColor,
        'low-emphesis': '#575757',
        primary: '#BFBFBF',
        secondary: '#7F7F7F',
        'high-emphesis': '#E3E3E3'
      },
      backgroundColor: {
        ...defaultTheme.backgroundColor,
        'dark-1000': '#0D0415',
        'dark-900': '#161522',
        'dark-800': '#202231',
        'dark-pink': '#221825',
        'dark-blue': '#0F182A',
        'input': "#2E3348"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
  corePlugins: {
    fontFamily: true,
    preflight: true
  },
  purge: process.env.NODE_ENV !== 'development' ? ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'] : false
}
