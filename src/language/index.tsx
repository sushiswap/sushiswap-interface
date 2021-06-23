import { FC, useEffect, useState } from 'react'

import { I18nProvider } from '@lingui/react'
import getConfig from 'next/config'
import { i18n } from '@lingui/core'
import { useRouter } from 'next/router'

const { publicRuntimeConfig } = getConfig()
const { locales } = publicRuntimeConfig

// Don't load plurals
locales.map((locale) => i18n.loadLocaleData(locale, { plurals: () => null }))

/**
 * Load messages for requested locale and activate it.
 * This function isn't part of the LinguiJS library because there are
 * many ways how to load messages — from REST API, from file, from cache, etc.
 */
export async function activate(locale: string) {
  const { messages } = await import(`@lingui/loader!./../../locale/${locale}.po`)
  i18n.load(locale, messages)
  i18n.activate(locale)
}

const LanguageProvider: FC = ({ children }) => {
  const { locale } = useRouter()
  const [init, setInit] = useState(true)

  useEffect(() => {
    async function initilise() {
      await activate(locale)
      setInit(false)
    }
    initilise()
  }, [])

  useEffect(() => {
    activate(locale)
  }, [locale])

  if (init) return <></>

  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
      {children}
    </I18nProvider>
  )
}

export default LanguageProvider
