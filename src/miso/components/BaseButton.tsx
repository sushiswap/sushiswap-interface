import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const ButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    padding: 0 3px;
  }

  &.btn-default {
    background: #f46e41;
    background-image: linear-gradient(to bottom left,#f46e41,#ba54f5,#f46e41);
    background-size: 210% 210%;
    background-position: 100% 0;
    background-color: #f46e41;
    transition: all .15s ease;
    box-shadow: none;
    color: #fff;
  }
  &.bg-orange {
    background: #f46e41!important;
  }
  &.disabled {
    opacity: .5;
    filter: alpha(opacity=50);
    pointer-events: none;
  }
`

interface BaseButtonProps {
  round?: boolean
  className?: string
  minWidth?: string | number
  icon?: boolean
  block?: boolean
  loading?: boolean
  wide?: boolean
  disabled?: boolean
  type?: string
  nativeType?: 'button' | 'submit' | 'reset'
  size?: string
  simple?: boolean
  link?: boolean
  onClick?: () => void
  preIconContent?: () => React.ReactNode
  loadingContent?: () => React.ReactNode
  children?: any
}

export default function BaseButton({
  round,
  className,
  minWidth = 120,
  block,
  loading,
  wide,
  disabled,
  type = 'default',
  nativeType = 'button',
  size,
  simple,
  link,
  onClick,
  preIconContent,
  loadingContent,
  children
}: BaseButtonProps) {
  return (
    <ButtonContainer
      type={nativeType}
      disabled={disabled}
      style={{
        minWidth: minWidth ? minWidth + 'px' : wide ? '140px' : ''
      }}
      className={`
        ${round ? 'rounded' : ''}
        ${block ? 'block w-full' : ''}
        ${size ? 'btn-' + size : 'py-3'}
        ${type ? 'btn-' + type : ''}
        ${simple ? 'btn-simple' : ''}
        ${link ? 'btn-link' : ''}
        ${disabled ? 'disabled' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      { preIconContent && preIconContent() }
      {
        loading &&
          (loadingContent ? loadingContent() :  <FontAwesomeIcon icon={faSpinner} />)
      }
      { children }
    </ButtonContainer>
  )
}