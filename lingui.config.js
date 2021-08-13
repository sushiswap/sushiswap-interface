module.exports = {
  catalogs: [
    {
      path: '<rootDir>/locale/{locale}',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  compileNamespace: 'cjs',
  extractBabelOptions: {},
  fallbackLocales: {},
  format: 'minimal',
  formatOptions: { origins: false, lineNumbers: false },
  sourceLocale: 'en',
  locales: ['de', 'en', 'es', 'it', 'ro', 'ru', 'vi', 'zh_CN', 'zh_TW', 'ko', 'ja', 'fr', 'fa', 'pt_BR', 'hi'],
  orderBy: 'messageId',
  pseudoLocale: '',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
}
