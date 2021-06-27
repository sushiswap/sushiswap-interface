module.exports = function (api) {
  const isServer = api.caller((caller) => caller?.isServer)
  const isCallerDevelopment = api.caller((caller) => caller?.isDev)

  const presets = [
    [
      'next/babel',
      {
        'preset-react': {
          importSource: !isServer && isCallerDevelopment ? '@welldone-software/why-did-you-render' : 'react',
        },
      },
    ],
  ]

  const plugins = ['macros', ['styled-components', { ssr: true }]]

  return { presets, plugins }
}
