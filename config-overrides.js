// const rewireReactHotLoader = require("react-app-rewire-hot-loader");

// module.exports = function override(config, env) {
//   config = rewireReactHotLoader(config, env)

//   config.resolve.alias = {
//     ...config.resolve.alias,
//     'react-dom': '@hot-loader/react-dom'
//   }
// }

const rewireReactHotLoader = require('react-app-rewire-hot-loader')

/* config-overrides.js */
module.exports = function override (config, env) {
  config = rewireReactHotLoader(config, env)
  return config
}