// babel.config.js
module.exports = function (api) {
  const isServer = api.caller((caller) => caller?.isServer)
  const isCallerDevelopment = api.caller((caller) => caller?.isDev)

  const presets =
    !isServer && isCallerDevelopment
      ? [
          'next/babel',
          {
            'preset-react': {
              importSource: '@welldone-software/why-did-you-render',
            },
          },
        ]
      : ['next/babel']

  return { presets, plugins: ['macros'] }
}
