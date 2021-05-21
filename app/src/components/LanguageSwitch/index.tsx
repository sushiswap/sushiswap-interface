import { MenuFlyout, StyledMenu, StyledMenuButton } from '../StyledMenu'
import React, { memo, useRef } from 'react'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { ApplicationModal } from '../../state/application/actions'
import Image from 'next/image'
import styled from 'styled-components'
import { useLanguageData } from '../../language/hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

const ChFlag = '/images/flags/ch-flag.png'
const DeFlag = '/images/flags/de-flag.png'
const EnFlag = '/images/flags/en-flag.png'
const EsFlag = '/images/flags/es-flag.png'
const ItFlag = '/images/flags/it-flag.png'
const HeFlag = '/images/flags/he-flag.png'
const RoFlag = '/images/flags/ro-flag.png'
const RuFlag = '/images/flags/ru-flag.png'
const ViFlag = '/images/flags/vi-flag.png'

const ExtendedStyledMenuButton = styled(StyledMenuButton)`
    display: flex;
    align-items: center;
    border: 2px solid rgb(23, 21, 34);
    border-radius: 10px;
    font-size: 1.25rem;
    &:hover {
        border-color: rgb(33, 34, 49);
    }
`

const ExtendedMenuFlyout = styled(MenuFlyout)`
    min-width: 10rem;
    // ${({ theme }) => theme.mediaWidth.upToMedium`
    max-height: 232px;
    overflow: auto;
    min-width: 11rem;
    top: -16.5rem;
  `};
`

const MenuItem = styled.span`
    display: flex;
    align-items: center;
    flex: 1;
    padding: 0.5rem 0.5rem;
    font-weight: 500;
    border-radius: 10px;
    // color: ${({ theme }) => theme.text2};
    :hover {
        // color: ${({ theme }) => theme.text1};
        cursor: pointer;
        text-decoration: none;
    }
    > svg {
        margin-right: 8px;
    }
`

const MenuItemFlag = styled(Image)`
    display: inline;
    margin-right: 0.625rem;
    width: 20px;
    height: 20px;
    vertical-align: middle;
`

const MenuButtonFlag = styled(Image)`
    width: 22px;
    height: 22px;
    vertical-align: middle;
`

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
    he: {
        flag: HeFlag,
        language: 'Hebrew'
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
    const node = useRef<HTMLDivElement>(null)
    const open = useModalOpen(ApplicationModal.LANGUAGE)
    const toggle = useToggleModal(ApplicationModal.LANGUAGE)
    useOnClickOutside(node, open ? toggle : undefined)
    const { language, setLanguage } = useLanguageData()

    const onClick = (key: string) => {
        setLanguage(key)
        toggle()
    }

    return (
        <StyledMenu ref={node}>
            <ExtendedStyledMenuButton onClick={toggle}>
                <Image src={LANGUAGES[language].flag} alt={LANGUAGES[language].language} width={22} height={22} />
            </ExtendedStyledMenuButton>
            {open && (
                <ExtendedMenuFlyout>
                    {Object.entries(LANGUAGES).map(([key, { flag, language, dialect }]) => (
                        <MenuItem onClick={() => onClick(key)} key={key}>
                            <MenuItemFlag src={flag} width={20} height={20} alt={language} />
                            <span className="ml-4">{language}</span>
                            {dialect && (
                                <sup>
                                    <small>{dialect}</small>
                                </sup>
                            )}
                        </MenuItem>
                    ))}
                </ExtendedMenuFlyout>
            )}
        </StyledMenu>
    )
}

export default memo(LanguageSwitch)
