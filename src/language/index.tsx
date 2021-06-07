/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import { Helmet } from 'react-helmet'
import { detect, fromStorage, fromNavigator } from '@lingui/detect-locale'
import defaultLanguage from '../assets/locale/en.json'

// This array should equal the array set in .linguirc
export const locales = ['de', 'en', 'es-AR', 'es', 'it', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW', 'ko', 'ja', 'pt-BR', 'hi']
export const defaultLocale = 'en'

// Activate default language
i18n.load(defaultLocale, defaultLanguage)
i18n.activate(defaultLocale)

// Don't load plurals
locales.map(locale => i18n.loadLocaleData(locale, { plurals: () => null }))

const isLocaleValid = (locale: string) => locales.includes(locale)
const getInitialLocale = () => {
    const detectedLocale = detect(fromStorage('lang'), fromNavigator(), () => defaultLocale)
    return detectedLocale && isLocaleValid(detectedLocale) ? detectedLocale : defaultLocale
}

async function activate(locale: string) {
    const resp = await fetch(`https://d3l928w2mi7nub.cloudfront.net/locales/${locale}/catalog.json`)
    const messages = await resp.json()
    i18n.load(locale, messages)
    i18n.activate(locale)
}

export const LanguageContext = React.createContext<{
    setLanguage: (_: string) => void
    language: string
}>({
    setLanguage: (_: string) => null,
    language: ''
})

const LanguageProvider: FC = ({ children }) => {
    const [language, setLanguage] = useState(getInitialLocale())

    const _setLanguage = (language: string): void => {
        activate(language).then(() => {
            localStorage.setItem('lang', language)
            setLanguage(language)
        })
    }

    useEffect(() => {
        ;(async () => await activate(language))()
    }, [])

    return (
        <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
            <Helmet htmlAttributes={{ lang: language }} />
            <LanguageContext.Provider value={{ setLanguage: _setLanguage, language }}>
                {children}
            </LanguageContext.Provider>
        </I18nProvider>
    )
}

export default LanguageProvider
