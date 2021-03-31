module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      
    }
  },
  variants: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    fontFamily: false,
    preflight: true
  },
  purge: process.env.NODE_ENV !== 'development' ? ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'] : false
}
