import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { AlertTriangle } from 'react-feather'
import Slider from 'rc-slider'

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  padding: 2px;

  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`

export const BottomGrouping = styled.div`
  margin-top: 1rem;
`

export function SwapCallbackError({ error }: { error: ReactNode }) {
  return (
    <div className="flex items-center justify-center pt-6 text-red">
      <AlertTriangle size={16} />
      <div className="ml-4 text-sm">{error}</div>
    </div>
  )
}

export const StyledSlider = styled(Slider)`
  margin: 0.8rem auto 2rem auto;
  width: 95% !important;

  .rc-slider-mark-text {
    color: #575757;
  }

  .rc-slider-mark-text-active {
    color: #7f7f7f;
  }

  .rc-slider-rail {
    background-color: #202231;
  }

  .rc-slider-track {
    background: linear-gradient(to right, #27b0e6, #fa52a0);
  }

  .rc-slider-handle {
    border-color: #fa52a0;
  }

  .rc-slider-handle:hover {
    border-color: #fa52a0;
  }

  .rc-slider-handle-click-focused:focus {
    border-color: #fa52a0;
  }

  .rc-slider-dot-active {
    border-color: #fa52a0;
  }
`
