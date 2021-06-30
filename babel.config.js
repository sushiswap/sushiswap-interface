module.exports = function () {
  const presets = [['next/babel']]
  const plugins = ['macros', ['styled-components', { ssr: true }]]
  return { presets, plugins }
}
