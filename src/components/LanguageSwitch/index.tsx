import { MenuFlyout, StyledMenu, StyledMenuButton } from 'components/StyledMenu'
import React, { memo, useRef } from 'react'
import styled from 'styled-components'
import ChFlag from '../../assets/images/ch-flag.png'
import DeFlag from '../../assets/images/de-flag.png'
import EnFlag from '../../assets/images/en-flag.png'
import EsFlag from '../../assets/images/es-flag.png'
import ItFlag from '../../assets/images/it-flag.png'
import HeFlag from '../../assets/images/he-flag.png'
import RoFlag from '../../assets/images/ro-flag.png'
import RuFlag from '../../assets/images/ru-flag.png'
import ViFlag from '../../assets/images/vi-flag.png'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useLanguageData } from '../../language/hooks'

const ExtendedStyledMenuButton = styled(StyledMenuButton)`
    border: 2px solid rgb(23, 21, 34);
    border-radius: 10px;
    font-size: 1.25rem;
    height: 40px;

    &:hover {
        border-color: rgb(33, 34, 49);
    }
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
    display: inline;
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
                <MenuButtonFlag src={LANGUAGES[language].flag} alt={LANGUAGES[language].language} />
            </ExtendedStyledMenuButton>
            {open && (
                <ExtendedMenuFlyout>
                    {Object.entries(LANGUAGES).map(([key, { flag, language, dialect }]) => (
                        <MenuItem onClick={() => onClick(key)} key={key}>
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
