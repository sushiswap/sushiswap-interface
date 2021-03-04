import React, { useRef } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { useTranslation } from 'react-i18next'

const StyledMenuButton = styled.button`
  font-size: 1.25rem;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.4rem;
  border-radius: ${({ theme }) => theme.borderRadius};

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;

  ${({ theme }) => theme.mediaWidth.upToExtra2Small`
    margin-left: 0.2rem;
  `};
`

const MenuFlyout = styled.span`
  min-width: 10rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};
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

export default function LanguageSwitch() {
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
      <StyledMenuButton onClick={toggle}>{LANGUAGES[i18n.language].flag}</StyledMenuButton>
      {open && (
        <MenuFlyout>
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
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
