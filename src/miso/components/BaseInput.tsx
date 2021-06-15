import React, { useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { trim } from 'lodash'

const FormGroup = styled.div`
  margin-bottom: 10px;
  position: relative;
`

const InputLabel = styled.label`
  font-size: 0.75rem;
  margin-bottom: 5px;

  color: rgba(255, 255, 255, 0.6);
`

const InputContainer = styled.input`
  padding: 10px 18px 10px 18px;

  transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;

  display: block;
  width: 100%;
  height: calc(2.25rem + 2px);
  font-size: 0.875rem;
  line-height: 1.42857;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgb(22, 21, 34);
  background-clip: padding-box;
  border: 1px solid #cad1d7;
  border-radius: 0;
  box-shadow: none;

  font-family: "Montserrat";

  overflow: visible;

  margin: 0;

  ::-webkit-inner-spin-button{
    -webkit-appearance: none; 
    margin: 0; 
  }
  ::-webkit-outer-spin-button{
      -webkit-appearance: none; 
      margin: 0; 
  }    
`

const InvalidFeedback = styled.div`
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #cc0044;
`

interface BaseInputProps {
  required?: boolean,
  group?: boolean,
  alternative?: boolean,
  label?: string,
  subLabel?: string,
  error?: string,
  successMessage?: string,
  labelClasses?: string,
  subLabelClasses?: string,
  inputClasses?: string,
  inputGroupClasses?: string,
  value?: string | number,
  type?: string,
  appendIcon?: string,
  prependIcon?: string,
  rules?: any,
  name?: string,
  rounded?: boolean,
  bgColor?: string[]
  placeholder?: string,
  min?: string,
  onInputChange?: (val: string | undefined) => void
  onInputFocus?: () => void
  onInputBlur?: () => void
}

export default function BaseInput({
  required,
  group,
  alternative,
  label,
  subLabel,
  error,
  successMessage,
  labelClasses,
  subLabelClasses,
  inputClasses,
  inputGroupClasses,
  value,
  type,
  appendIcon,
  prependIcon,
  rules,
  name,
  rounded,
  bgColor,
  placeholder,
  min,
  onInputChange,
  onInputFocus,
  onInputBlur
}: BaseInputProps) {
  const [focused, setFocused] = useState<boolean>(false)
  const [errormsg, setErrormsg] = useState<string>('')
  const [invalid, setInvalid] = useState<boolean>(false)

  function hasIcon() {
    return (
      appendIcon !== undefined ||
      prependIcon !== undefined ||
      group
    )
  }

  function setStyle(){
    let styles = {}
    if (focused) {
      if (invalid) {
        const firstStyle = {
          borderColor: '#cc0044',
          boxShadow: '0 0 0 0 rgba(250,58,58,0.25)'
        }
        styles = Object.assign(styles,firstStyle)
      }
      else {
        const firstStyle = {
          borderColor: '#f46e41',
          backgroundColor: 'rgb(22, 21, 34)',
          boxShadow: 'none'
        }
        styles = Object.assign(styles, firstStyle)
      }
    }
    else if (invalid) {
      const firstStyle = {
        borderColor: '#cc0044',
        backgroundImage: 'none'
      }
      styles = Object.assign(styles,firstStyle)
    }
    if (bgColor) {
        const secondStyle = {
          background:bgColor[0]
        }
        styles = Object.assign(styles,secondStyle)
    }
    return styles
  }

  function onFocus() {
    setFocused(true)
    if ( onInputFocus )
      onInputFocus()
  }

  function onChange(val: string) {
    if (trim(val) === '') {
      setErrormsg('The ' + name + ' field is required')
      setInvalid(true)
    }
    else {
      if (type === 'number' && trim(val) === '0') {
        setErrormsg('The ' + name + ' field must be 1 or more')
        setInvalid(true)
      }
      else {
        setErrormsg('')
        setInvalid(false)
      }
    }
    if ( onInputChange )
      onInputChange(val)
  }

  function onBlur(val: string) {
    if (trim(val) === '') {
      setErrormsg('The ' + name + ' field is required')
      setInvalid(true)
    }
    else {
      if (type === 'number' && trim(val) === '0') {
        setErrormsg('The ' + name + ' field must be 1 or more')
        setInvalid(true)
      }
      else {
        setErrormsg('')
        setInvalid(false)
      }
    }
    if ( onInputBlur )
      onInputBlur()
  }

  return (
    <FormGroup>
      {label && (
        <InputLabel className={labelClasses}>{label}</InputLabel>
      )}
      <div
        className={`
          ${hasIcon() ? 'input-group' : ''}
          ${alternative ? 'input-group-alternative' : ''}
          ${label ? 'has-label mt-2' : ''}
        `}
      >
        {prependIcon && (
          <div
            className={`
              input-group-prepend
              ${rounded ? 'input-group-prepend_round' : ''}
            `}>
              <span
                className={`
                  input-group-text px-2
                  ${rounded ? 'prepend-rounded-icon' : ''}
                `}>
              </span>
          </div>
        )}
        <InputContainer
          value={value}
          type={type}
          required={required}
          style={setStyle()}
          placeholder={placeholder}
          min={min ? min : ''}
          className={`
            form-control font-bold text-bg-white
            ${successMessage ? 'input-group-prepend_round' : ''}
            ${rounded && !prependIcon ? 'is-rounded' : ''}
            ${rounded && prependIcon ? 'prepend-rounded-input' : ''}
          `}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => onFocus()}
          onBlur={(e) => onBlur(e.target.value)}
        />
        {appendIcon && (
          <div className="input-group-append">
            <span className="input-group-text">
                <i className="appendIcon"></i>
            </span>
          </div>
        )}
      </div>
      {subLabel && (
        <label className={subLabelClasses}>{subLabel}</label>
      )}
      {errormsg && (
        <InvalidFeedback>{errormsg}</InvalidFeedback>
      )}
    </FormGroup>
  )
}