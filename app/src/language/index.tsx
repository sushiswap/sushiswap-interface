/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'
import { detect, fromNavigator, fromStorage } from '@lingui/detect-locale'

import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'

// This array should equal the array set in .linguirc
export const locales = ['de', 'en', 'es-AR', 'es', 'it', 'he', 'ro', 'ru', 'vi', 'zh-CN', 'zh-TW', 'ko', 'ja']
export const defaultLocale = 'en'

// Don't load plurals
locales.map(locale => i18n.loadLocaleData(locale, { plurals: () => null }))

const isLocaleValid = (locale: string) => locales.includes(locale)

const getInitialLocale = () => {
    const detectedLocale = detect(fromStorage('lang'), fromNavigator(), () => defaultLocale)
    return detectedLocale && isLocaleValid(detectedLocale) ? detectedLocale : defaultLocale
}

/**
 * Load messages for requested locale and activate it.
 * This function isn't part of the LinguiJS library because there're
 * many ways how to load messages — from REST API, from file, from cache, etc.
 */
export async function activate(locale: string) {
    const { messages } = await import(`./locales/${locale}/catalog.js`)
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
    const [init, setInit] = useState(true)

    const _setLanguage = (language: string): void => {
        if (!init) {
            activate(language).then(() => {
                localStorage.setItem('lang', language)
                setLanguage(language)
            })
        } else {
            localStorage.setItem('lang', language)
            setLanguage(language)
        }
    }

    useEffect(() => {
        const load = async () => {
            await activate(language)
            setInit(false)
        }

        load()
    }, [])

    if (init) return <></>

    return (
        <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
            <LanguageContext.Provider value={{ setLanguage: _setLanguage, language }}>
                {children}
            </LanguageContext.Provider>
        </I18nProvider>
    )
}

export default LanguageProvider
