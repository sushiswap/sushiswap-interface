// const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const rewirePostCss = require('react-app-rewire-postcss')

module.exports = function override (config, env) {
  config = rewirePostCss(config, true)
  return config
}