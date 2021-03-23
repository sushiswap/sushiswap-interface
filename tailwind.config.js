// const defaultTheme = require('tailwindcss/defaultTheme')
// const colors = require("tailwindcss/colors");

module.exports = {
  //prefix: "sushi-",
  darkMode: 'class',
  theme: {
    // screens: {
    //   sm: '640px',
    //   // => @media (min-width: 640px) { ... }
    //   md: '768px',
    //   // => @media (min-width: 768px) { ... }
    //   lg: '1024px',
    //   // => @media (min-width: 1024px) { ... }
    //   xl: '1280px',
    //   // => @media (min-width: 1280px) { ... }
    //   '2xl': '1536px'
    //   // => @media (min-width: 1536px) { ... }
    // },
    extend: {
      // fontFamily: {
      //   sans: ['Poppins', 'sans-serif']
      // },
      // backgroundColor: {
      //   primary: 'var(--color-bg-primary)',
      //   secondary: 'var(--color-bg-secondary)'
      // },
      // textColor: {
      //   accent: 'var(--color-text-accent)',
      //   primary: 'var(--color-text-primary)',
      //   secondary: 'var(--color-text-secondary)'
      // },
      // colors: {
      //   'purple-brand': '#3e3e7c',
      //   'purple-brand-lighter': '#333367',
      //   'pink-brand': '#fa52a0',
      //   'blue-brand': '#0090a6',
      //   'blue-brand-light': '#27B0E6',
      //   'blue-brand-dark': '#067587',
      //   'green-finance': '#04c806',
      //   'red-finance': '#ff5001',
      //   'brand-1': '#FFBEE3',
      //   'brand-2': '#FFA8EC',
      //   'brand-3': '#C58FD4',
      //   'brand-4': '#AC9ADD',
      //   'brand-5': '#687FBE',
      //   'brand-6': '#5C98D4',
      //   'brand-7': '#44AAE3',
      //   'blue-trader': '#1976d3',
      //   'gray-trader-outline': '#374151',
      //   'gray-trader-input': '#1f222d',
      //   'gray-trader-base': '#121722'
      // },
      // linearBorderGradients: theme => ({
      //   colors: theme('colors')
      // })
    }
  },
  variants: {},
  //plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')],
  purge: false, //If you have manually configured PurgeCSS outside of Tailwind
  corePlugins: {
    fontFamily: false,
    preflight: true
  }
}
