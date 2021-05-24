module.exports = {
    catalogs: [
      {
        path: "<rootDir>/src/language/locales/{locale}/catalog",
        include: ["<rootDir>/src"],
        exclude: ["**/node_modules/**"],
      },
    ],
    compileNamespace: 'cjs',
    extractBabelOptions: {},
    fallbackLocales: {},
    format: 'minimal',
    sourceLocale: "en",
    locales: [
      'de',
      'en', 
      'es-AR', 
      'es', 
      'it', 
      'he', 
      'ro', 
      'ru', 
      'vi', 
      'zh-CN',
      'zh-TW', 
      'ko', 
      'ja', 
      'fr'
    ],
    orderBy: 'messageId',
    pseudoLocale: '',
    rootDir: '.',
    runtimeConfigModule: ['@lingui/core', 'i18n']
}
