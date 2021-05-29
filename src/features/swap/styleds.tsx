import 'rc-slider/assets/index.css'

import styled, { css } from 'styled-components'

import { AlertTriangle } from 'react-feather'
import React from 'react'
import Slider from 'rc-slider'
import { Text } from 'rebass'

export const Wrapper = styled.div`
    position: relative;
    padding: 1rem;
`

export const ClickableText = styled(Text)`
    :hover {
        cursor: pointer;
    }
    // color: ${({ theme }) => theme.primary1};
`

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

export const SectionBreak = styled.div`
    height: 1px;
    width: 100%;
    // background-color: ${({ theme }) => theme.bg3};
`

export const BottomGrouping = styled.div`
    margin-top: 1rem;
`

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
    color: ${({ theme, severity }) =>
        severity === 3 || severity === 4
            ? theme.red1
            : severity === 2
            ? theme.yellow2
            : severity === 1
            ? theme.text3
            : theme.green1};
`

export const StyledBalanceMaxMini = styled.button`
    height: 22px;
    width: 22px;
    // background-color: ${({ theme }) => theme.bg2};
    border: none;
    border-radius: 50%;
    padding: 0.2rem;
    font-size: 0.875rem;
    font-weight: 400;
    margin-left: 0.4rem;
    cursor: pointer;
    // color: ${({ theme }) => theme.text2};
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;

    :hover {
        // background-color: ${({ theme }) => theme.bg3};
    }
    :focus {
        // background-color: ${({ theme }) => theme.bg3};
        outline: none;
    }
`

// styles
export const Dots = styled.span`
    &::after {
        display: inline-block;
        animation: ellipsis 1.25s infinite;
        content: '.';
        width: 1em;
        text-align: left;
    }
    @keyframes ellipsis {
        0% {
            content: '.';
        }
        33% {
            content: '..';
        }
        66% {
            content: '...';
        }
    }
`

export function SwapCallbackError({ error }: { error: string }) {
    return (
        <div className="flex items-center justify-center pt-6 text-red">
            <AlertTriangle size={16} />
            <div className="ml-4 text-sm">{error}</div>
        </div>
    )
}

export const StyledSlider = styled(Slider)`
    margin: 0.8rem auto 2rem auto;
    width: 90% !important;

    .rc-slider-mark-text-active {
        color: #e3e3e3;
    }

    .rc-slider-rail {
        background-color: #202231;
    }

    .rc-slider-mark-text {
        color: #bfbfbf;
    }

    .rc-slider-track {
        background: linear-gradient(to right, #27b0e6, #fa52a0);
    }

    .rc-slider-handle {
        border-color: #fa52a0;
    }

    .rc-slider-handle:hover {
        border-color: #4caf52;
    }

    .rc-slider-handle-click-focused:focus {
        border-color: #fa52a0;
    }

    .rc-slider-dot-active {
        border-color: #fa52a0;
    }
`
