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
  format: 'po',
  sourceLocale: 'en',
  locales: ['de', 'en', 'es-AR', 'es', 'it', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW', 'ko', 'ja', 'fr'],
  orderBy: 'messageId',
  pseudoLocale: '',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
}
