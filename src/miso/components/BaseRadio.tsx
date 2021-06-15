import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import './baseradio.css'

interface BaseRadioProps {
  name?: string | number
  disabled?: boolean
  value?: boolean
  inline?: boolean
  caption?: string
  radioname?: string
  currenttype?: string
  onRadioClick?: (val: any) => void
}

export default function BaseRadio({
  name,
  disabled = false,
  value = false,
  inline = false,
  caption,
  radioname,
  onRadioClick
}: BaseRadioProps) {
  const cbId = Math.random().toString(16).slice(2)

  return (
    <div
      className={`
        mb-3 capitalize form-check form-check-radio
        ${inline ? 'form-check-inline' : ''}
        ${disabled ? 'disabled' : ''}
      `}
    >
      <label htmlFor={cbId} className="form-check-label">
        <input
          id={cbId}
          type="radio"
          disabled={disabled}
          value={name}
          className={`
            form-check-input
          `}
          name={radioname}
          checked={value}
          onChange={(e) => onRadioClick? onRadioClick(name): null}
        />
        {caption}
        <span className="form-check-sign"></span>
      </label>
    </div>
  )
}