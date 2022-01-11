import { ChevronDownIcon } from '@heroicons/react/solid'
import Popover from 'app/components/Popover'
import { classNames } from 'app/functions'
import cookieCutter from 'cookie-cutter'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Typography from '../Typography'

const LANG_TO_COUNTRY = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  ro: 'Română',
  ru: 'Русский',
  vi: 'Tiếng Việt',
  zh_CN: '简体中文',
  zh_TW: '繁體中文',
  ko: '한국어',
  ja: '日本語',
  fa: 'فارسی',
  pt_BR: 'Português',
  hi: 'हिन्दी',
  es: 'Español',
  tr: 'Türkçe',
  el: 'ελληνικά',
}

export default function LangSwitcher() {
  const { locale } = useRouter()
  const [show, setShow] = useState(false)

  return (
    <Popover
      placement="bottom-end"
      modifiers={[{ name: 'offset', options: { offset: [8, 0] } }]}
      show={show}
      content={<LanguageSwitcherContent onClick={() => setShow(false)} />}
    >
      <div
        onClick={() => setShow(!show)}
        className="cursor-pointer bg-dark-1000 inline-flex justify-center w-full px-4 py-2 text-sm font-bold bg-transparent border-2 rounded shadow-sm text-primary border-dark-800 hover:border-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-700 focus:ring-dark-800"
      >
        {LANG_TO_COUNTRY[locale]}
        <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
      </div>
    </Popover>
  )
}

export const LanguageSwitcherContent = ({ onClick }: { onClick?(): void }) => {
  const { locales, asPath } = useRouter()
  return (
    <div className="px-2 mt-3">
      <div className="shadow-lg overflow-hidden bg-dark-900 rounded border border-dark-700">
        {locales.map((l) => {
          return (
            <div key={l} onClick={onClick}>
              <Link href={asPath} locale={l} passHref={true}>
                <a
                  className={classNames('flex gap-3 p-3 transition duration-150 ease-in-out hover:bg-dark-800')}
                  onClick={() => cookieCutter.set('NEXT_LOCALE', l)}
                >
                  <Typography variant="xs" weight={700}>
                    {LANG_TO_COUNTRY[l]}
                  </Typography>
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
