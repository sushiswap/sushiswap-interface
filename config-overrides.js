const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const rewirePostCss = require('react-app-rewire-postcss')

module.exports = function override (config, env) {
  config = rewireReactHotLoader(config, env)
  config = rewirePostCss(config, env)
  return config
}