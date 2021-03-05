import React, { useRef, memo } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useTranslation } from 'react-i18next'
import { StyledMenu, MenuFlyout, StyledMenuButton } from 'components/StyledMenu'

const ExtendedStyledMenuButton = styled(StyledMenuButton)`
  font-size: 1.25rem;
`

const ExtendedMenuFlyout = styled(MenuFlyout)`
  min-width: 10rem;
`

const MenuItem = styled.span`
  align-items: center;
  flex: 1;
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

const MenuItemFlag = styled.span`
  padding-right: 0.5rem;
`

const LANGUAGES: { [x: string]: { flag: string; language: string; dialect?: string } } = {
  en: {
    flag: '🇬🇧',
    language: 'English'
  },
  de: {
    flag: '🇩🇪',
    language: 'German'
  },
  it: {
    flag: '🇮🇹',
    language: 'Italian'
  },
  iw: {
    flag: '🇮🇱',
    language: 'Hebrew'
  },
  ru: {
    flag: '🇷🇺',
    language: 'Russian'
  },
  ro: {
    flag: '🇷🇴',
    language: 'Romanian'
  },
  vi: {
    flag: '🇻🇳',
    language: 'Vietnamese'
  },
  'zh-CN': {
    flag: '🇨🇳',
    language: 'Chinese',
    dialect: '简'
  },
  'zh-TW': {
    flag: '🇨🇳',
    language: 'Chinese',
    dialect: '繁'
  },
  'es-US': {
    flag: '🇪🇸',
    language: 'Spanish'
  },
  'es-AR': {
    flag: '🇪🇸',
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

  return (
    <StyledMenu ref={node}>
      <ExtendedStyledMenuButton onClick={toggle}>{LANGUAGES[i18n.language].flag}</ExtendedStyledMenuButton>
      {open && (
        <ExtendedMenuFlyout>
          {Object.entries(LANGUAGES).map(([key, { flag, language, dialect }]) => (
            <MenuItem onClick={() => changeLanguage(key)} key={key}>
              <MenuItemFlag>{flag}</MenuItemFlag> {language}{' '}
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
