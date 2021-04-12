import React from 'react'
import styled, { keyframes } from 'styled-components'
import { darken, lighten } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'

const Base = styled(RebassButton)<{
    padding?: string
    width?: string
    borderRadius?: string
    altDisabledStyle?: boolean
}>`
    padding: ${({ padding }) => (padding ? padding : '18px')};
    width: ${({ width }) => (width ? width : '100%')};
    font-weight: 500;
    text-align: center;
    border-radius: 10px;
    border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
    outline: none;
    border: 1px solid transparent;
    color: white;
    text-decoration: none;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
    position: relative;
    z-index: 1;
    &:disabled {
        cursor: auto;
    }

    > * {
        user-select: none;
    }
`

const sheen = keyframes`{
  100% {
    transform: rotateZ(60deg) translate(1em, -23em);
  }
}`

export const ButtonPrimary = styled(Base)`
  /* background-color: ${({ theme }) => theme.primary1}; */
  overflow:hidden;
  background: linear-gradient(to right, #0094ec , #f537c3);
  background-origin: border-box;
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    /*background: ${({ theme }) => darken(0.05, theme.primary1)};*/
    background: linear-gradient(to right, #0094ec , #f537c3);
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    /*background: ${({ theme }) => darken(0.1, theme.primary1)};*/
    background: linear-gradient(to right, #0094ec , #f537c3);
  }
  &:disabled {
    pointer-events: none;
    background: ${({ theme, altDisabledStyle, disabled }) =>
        altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.bg3};
    color: ${({ theme, altDisabledStyle, disabled }) =>
        altDisabledStyle ? (disabled ? theme.text3 : 'white') : theme.text3};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
  }
  &:hover {
    /*background: ${({ theme }) => darken(0.05, theme.primary1)};*/
    background: linear-gradient(to right, #0094ec , #f537c3);
    background-origin: border-box;
    &::after {
      animation: ${sheen} 0.5s forwards;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -120%;
    background: linear-gradient(to bottom, rgba(229, 172, 142, 0), rgba(255,255,255,0.5) 50%, rgba(229, 172, 142, 0));
    transform: rotateZ(60deg) translate(-5em, 7.5em);
  }
`

export const ButtonPrimaryNormal = styled(Base)`
    background-color: ${({ theme }) => theme.primary1};
    color: white;
    &:focus {
        box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
        background-color: ${({ theme }) => darken(0.05, theme.primary1)};
    }
    &:hover {
        background-color: ${({ theme }) => darken(0.05, theme.primary1)};
    }
    &:active {
        box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
        background-color: ${({ theme }) => darken(0.1, theme.primary1)};
    }
    &:disabled {
        background-color: ${({ theme, altDisabledStyle, disabled }) =>
            altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.bg3};
        color: ${({ theme, altDisabledStyle, disabled }) =>
            altDisabledStyle ? (disabled ? theme.text3 : 'white') : theme.text3};
        cursor: auto;
        box-shadow: none;
        border: 1px solid transparent;
        outline: none;
        opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
    }
`

export const ButtonLight = styled(Base)`
    background-color: ${({ theme }) => theme.primary5};
    color: ${({ theme }) => theme.primaryText1};
    font-size: 16px;
    font-weight: 500;
    &:focus {
        box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
        background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
    }
    &:hover {
        background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
    }
    &:active {
        box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
        background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
    }
    :disabled {
        opacity: 0.4;
        :hover {
            cursor: auto;
            background-color: ${({ theme }) => theme.primary5};
            box-shadow: none;
            border: 1px solid transparent;
            outline: none;
        }
    }
`

export const ButtonGray = styled(Base)`
    background-color: ${({ theme }) => theme.bg3};
    color: ${({ theme }) => theme.text2};
    font-size: 16px;
    font-weight: 500;
    &:focus {
        background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
    }
    &:hover {
        background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
    }
    &:active {
        background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg4)};
    }
`

export const ButtonSecondary = styled(Base)`
    border: 1px solid ${({ theme }) => theme.primary4};
    color: ${({ theme }) => theme.primary1};
    background-color: transparent;
    font-size: 16px;
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ padding }) => (padding ? padding : '10px')};

    &:focus {
        box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
        border: 1px solid ${({ theme }) => theme.primary3};
    }
    &:hover {
        border: 1px solid ${({ theme }) => theme.primary3};
    }
    &:active {
        box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
        border: 1px solid ${({ theme }) => theme.primary3};
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
    }
    a:hover {
        text-decoration: none;
    }
`

export const ButtonPink = styled(Base)`
    background-color: ${({ theme }) => theme.primary1};
    color: white;

    &:focus {
        box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
        background-color: ${({ theme }) => darken(0.05, theme.primary1)};
    }
    &:hover {
        background-color: ${({ theme }) => darken(0.05, theme.primary1)};
    }
    &:active {
        box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
        background-color: ${({ theme }) => darken(0.1, theme.primary1)};
    }
    &:disabled {
        background-color: ${({ theme }) => theme.primary1};
        opacity: 50%;
        cursor: auto;
    }
`

export const ButtonUNIGradient = styled(ButtonPrimary)`
    color: white;
    padding: 4px 8px;
    height: 36px;
    font-weight: 500;
    background-color: ${({ theme }) => theme.bg3};
    background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #0094ec 100%), #edeef2;
    width: fit-content;
    position: relative;
    cursor: pointer;
    border: none;
    white-space: no-wrap;
    :hover {
        opacity: 0.8;
    }
    :active {
        opacity: 0.9;
    }
`

export const ButtonOutlined = styled(Base)`
    border: 1px solid ${({ theme }) => theme.bg2};
    background-color: transparent;
    color: ${({ theme }) => theme.text1};

    &:focus {
        box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    }
    &:hover {
        box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    }
    &:active {
        box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
    }
`

export const ButtonEmpty = styled(Base)`
    background-color: transparent;
    color: ${({ theme }) => theme.primary1};
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus {
        text-decoration: underline;
    }
    &:hover {
        text-decoration: none;
    }
    &:active {
        text-decoration: none;
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
    }
`

export const ButtonWhite = styled(Base)`
    border: 1px solid #edeef2;
    background-color: ${({ theme }) => theme.bg1};
    color: black;

    &:focus {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
    }
    &:hover {
        box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
    }
    &:active {
        box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
    }
`

const ButtonConfirmedStyle = styled(Base)`
    background-color: ${({ theme }) => lighten(0.5, theme.green1)};
    color: ${({ theme }) => theme.green1};
    border: 1px solid ${({ theme }) => theme.green1};

    &:disabled {
        opacity: 50%;
        cursor: auto;
    }
`

const ButtonErrorStyle = styled(Base)`
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};

    &:focus {
        box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
        background-color: ${({ theme }) => darken(0.05, theme.red1)};
    }
    &:hover {
        background-color: ${({ theme }) => darken(0.05, theme.red1)};
    }
    &:active {
        box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
        background-color: ${({ theme }) => darken(0.1, theme.red1)};
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
        box-shadow: none;
        background-color: ${({ theme }) => theme.red1};
        border: 1px solid ${({ theme }) => theme.red1};
    }
`

export function ButtonConfirmed({
    confirmed,
    altDisabledStyle,
    ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
    if (confirmed) {
        return <ButtonConfirmedStyle {...rest} />
    } else {
        return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
    }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
    if (error) {
        return <ButtonErrorStyle {...rest} />
    } else {
        return <ButtonPrimary {...rest} />
    }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
    return (
        <ButtonPrimary {...rest} disabled={disabled}>
            <RowBetween>
                <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
                <ChevronDown size={24} />
            </RowBetween>
        </ButtonPrimary>
    )
}

export function ButtonDropdownGrey({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
    return (
        <ButtonGray {...rest} disabled={disabled} style={{ borderRadius: '10px' }}>
            <RowBetween>
                <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
                <ChevronDown size={24} />
            </RowBetween>
        </ButtonGray>
    )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
    return (
        <ButtonOutlined {...rest} disabled={disabled}>
            <RowBetween>
                <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
                <ChevronDown size={24} />
            </RowBetween>
        </ButtonOutlined>
    )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
    if (!active) {
        return <ButtonWhite {...rest} />
    } else {
        return <ButtonPrimary {...rest} />
    }
}
