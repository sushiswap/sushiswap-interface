// const purgecss = require('@fullhuman/postcss-purgecss')({
//   // Specify the paths to all of the template files in your project
//   content: [
//     './src/**/*.js',
//     './public/index.html',
//     './src/**/*.html',
//     './src/**/*.vue',
//     './src/**/*.jsx',
//     './src/**/*.tsx',
//     './src/**/*.ts'
//   ],

//   // Include any special characters you're using in this regular expression
//   defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || []
// })

// run in production
// module.exports = {
//   plugins: [
//     require('tailwindcss'),
//     require('autoprefixer'),
//     ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
//   ]
// }

//Run for full tailwinds in development
module.exports = {
  plugins: [require('tailwindcss'), require('autoprefixer')]
}
