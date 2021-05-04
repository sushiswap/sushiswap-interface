/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import { Helmet } from 'react-helmet'
import { detect, fromStorage, fromNavigator } from '@lingui/detect-locale'

// This array should equal the array set in .linguirc
export const locales = ['de', 'en', 'es-AR', 'es', 'it', 'he', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW', 'ko', 'ja']
export const defaultLocale = 'en'

const isLocaleValid = (locale: string) => locales.includes(locale)
const getInitialLocale = () => {
    const detectedLocale = detect(fromStorage('lang'), fromNavigator(), () => defaultLocale)
    return detectedLocale && isLocaleValid(detectedLocale) ? detectedLocale : defaultLocale
}

async function activate(locale: string) {
    const { messages } = await import(/* webpackChunkName: "i18n-[index]" */ `./locales/${locale}/catalog.js`)
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
    console.log(getInitialLocale())
    const [language, setLanguage] = useState(getInitialLocale())
    const [init, setInit] = useState(true)

    const _setLanguage = (language: string): void => {
        localStorage.setItem('lang', language)
        setLanguage(language)
    }

    useEffect(() => {
        const load = async () => {
            await activate(language)
            setInit(false)
        }

        load()
    }, [])

    useEffect(() => {
        if (init) return

        activate(language)
    }, [language])

    return (
        <LanguageContext.Provider value={{ setLanguage: _setLanguage, language }}>
            <Helmet htmlAttributes={{ lang: language }} />
            {!init && <I18nProvider i18n={i18n}>{children}</I18nProvider>}
        </LanguageContext.Provider>
    )
}

export default LanguageProvider
