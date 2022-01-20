// babel.config.js
module.exports = function (api) {
  const isServer = api.caller((caller) => caller?.isServer)
  const isCallerDevelopment = api.caller((caller) => caller?.isDev)

  const next = [
    'next/babel'
  ],

  if (!isServer && isCallerDevelopment) {
    next.push({
      'preset-react': {
        importSource: '@welldone-software/why-did-you-render',
      },
    })
  }


  return { presets: [next], plugins: ['macros'] }
}
