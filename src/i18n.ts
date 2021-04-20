import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import XHR from 'i18next-xhr-backend'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18next
    // .use(XHR)
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: `/locales/{{lng}}.json`
        },
        react: {
            useSuspense: true
        },
        fallbackLng: 'en',
        preload: ['en'],
        debug: true,
        keySeparator: false,
        interpolation: { escapeValue: false }
    })

export default i18next
