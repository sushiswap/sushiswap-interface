import React, { useRef, memo } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useTranslation } from 'react-i18next'
import { StyledMenu, MenuFlyout, StyledMenuButton } from 'components/StyledMenu'
import ChFlag from '../../assets/images/ch-flag.png'
import EsFlag from '../../assets/images/es-flag.png'
import ItFlag from '../../assets/images/it-flag.png'
import RoFlag from '../../assets/images/ro-flag.png'
import RuFlag from '../../assets/images/ru-flag.png'
import ViFlag from '../../assets/images/vi-flag.png'
import EnFlag from '../../assets/images/en-flag.png'
import DeFlag from '../../assets/images/de-flag.png'
import IwFlag from '../../assets/images/iw-flag.png'

const ExtendedStyledMenuButton = styled(StyledMenuButton)`
    font-size: 1.25rem;
`

const ExtendedMenuFlyout = styled(MenuFlyout)`
    min-width: 10rem;

    ${({ theme }) => theme.mediaWidth.upToMedium`
    max-height: 232px;
    overflow: auto;
    min-width: 11rem;
    top: -16.5rem;
  `};
`

const MenuItem = styled.span`
    align-items: center;
    flex: 1;
    //display: flex;
    padding: 0.5rem 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text2};
    :hover {
        color: ${({ theme }) => theme.text1};
        cursor: pointer;
        text-decoration: none;
    }
    > svg {
        margin-right: 8px;
    }
`

const MenuItemFlag = styled.img`
    margin-right: 0.625rem;
    width: 20px;
    height: 20px;
    vertical-align: middle;
`

const MenuButtonFlag = styled.img`
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
    'it-IT': {
        flag: ItFlag,
        language: 'Italian'
    },
    iw: {
        flag: IwFlag,
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
    'es-US': {
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
    const { i18n } = useTranslation()

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng).then(() => {
            toggle()
        })
    }

    let language = i18n.language
    if (!LANGUAGES.hasOwnProperty(language)) {
        language = 'en'
    }

    return (
        <StyledMenu ref={node}>
            <ExtendedStyledMenuButton onClick={toggle}>
                <MenuButtonFlag src={LANGUAGES[language].flag} alt={LANGUAGES[language].language} />
            </ExtendedStyledMenuButton>
            {open && (
                <ExtendedMenuFlyout>
                    {Object.entries(LANGUAGES).map(([key, { flag, language, dialect }]) => (
                        <MenuItem onClick={() => changeLanguage(key)} key={key}>
                            <MenuItemFlag src={flag} alt={language} />
                            {language}{' '}
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
