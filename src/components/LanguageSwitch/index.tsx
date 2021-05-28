import { StyledMenu } from '../StyledMenu'
import React, { memo, useEffect, useRef } from "react";
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { ApplicationModal } from '../../state/application/actions'
import Image from 'next/image'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useRouter } from "next/router";
import Link from 'next/link';

const ChFlag = '/images/flags/ch-flag.png'
const DeFlag = '/images/flags/de-flag.png'
const EnFlag = '/images/flags/en-flag.png'
const EsFlag = '/images/flags/es-flag.png'
const ItFlag = '/images/flags/it-flag.png'
const RoFlag = '/images/flags/ro-flag.png'
const RuFlag = '/images/flags/ru-flag.png'
const ViFlag = '/images/flags/vi-flag.png'

// Use https://onlineunicodetools.com/convert-unicode-to-image to convert
// Unicode flags to png as Windows does not support Unicode flags
// Use 24px as unicode characters font size
const LANGUAGES: { [x: string]: { flag: string; language: string; dialect?: string } } = {
    en: {
        flag: EnFlag,
        language: 'English'
    },
    de: {
        flag: DeFlag,
        language: 'German'
    },
    it: {
        flag: ItFlag,
        language: 'Italian'
    },
    ru: {
        flag: RuFlag,
        language: 'Russian'
    },
    ro: {
        flag: RoFlag,
        language: 'Romanian'
    },
    vi: {
        flag: ViFlag,
        language: 'Vietnamese'
    },
    'zh-CN': {
        flag: ChFlag,
        language: 'Chinese',
        dialect: '简'
    },
    'zh-TW': {
        flag: ChFlag,
        language: 'Chinese',
        dialect: '繁'
    },
    es: {
        flag: EsFlag,
        language: 'Spanish'
    },
    'es-AR': {
        flag: EsFlag,
        language: 'Spanish',
        dialect: 'AR'
    }
}

function LanguageSwitch() {
    const { locale, pathname } = useRouter();
    const node = useRef<HTMLDivElement>(null)
    const open = useModalOpen(ApplicationModal.LANGUAGE)
    const toggle = useToggleModal(ApplicationModal.LANGUAGE)
    useOnClickOutside(node, open ? toggle : undefined)

    return (
        <StyledMenu ref={node}>
            <div className="cursor-pointer flex items-center justify-center border-2 rounded border-dark-850 hover:border-dark-700 h-[40px] w-[40px]" onClick={toggle}>
                <Image src={LANGUAGES[locale].flag} alt={LANGUAGES[locale].language} width={22} height={22} />
            </div>
            {open && (
                <div className="min-w-[10rem] max-h-[232px] md:max-h-[unset] absolute flex flex-col z-50 bg-dark-850 shadow-sm rounded md:top-[3rem] right-0 md:overflow-hidden overflow-scroll top-[-15.5rem]">
                    {Object.entries(LANGUAGES).map(([key, { flag, language, dialect }]) => (
                        <Link href={pathname} locale={key} key={key}>
                            <div className="cursor-pointer flex items-center px-3 py-1.5 hover:bg-dark-800 hover:text-high-emphesis font-bold" onClick={toggle}>
                                <Image className="inline mr-1 w-3 h-3 align-middle" src={flag} width={20} height={20} alt={language} />
                                <span className="ml-4">{language}</span>
                                {dialect && (
                                  <sup>
                                      <small>{dialect}</small>
                                  </sup>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </StyledMenu>
    )
}

export default memo(LanguageSwitch)
