import React, { FC, useCallback, useState } from 'react'

import { QuestionMarkCircleIcon as OutlineQuestionMarkCircleIcon } from '@heroicons/react/outline'
import { QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon } from '@heroicons/react/solid'
import Tooltip from '../Tooltip'
import styled from 'styled-components'

const QuestionWrapper = styled.div<{ noPadding?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props => (props.noPadding ? '0' : '0.2rem')};
    border: none;
    background: none;
    outline: none;
    cursor: default;
    border-radius: 36px;
    // background-color: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text2};

    :hover,
    :focus {
        opacity: 0.7;
    }
`

const LightQuestionWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border: none;
    background: none;
    outline: none;
    cursor: default;
    border-radius: 36px;
    width: 24px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.white};

    :hover,
    :focus {
        opacity: 0.7;
    }
`

const QuestionHelper: FC<{ text: any }> = ({ children, text }) => {
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    if (children) {
        return (
            <Tooltip text={text} show={show}>
                <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close} noPadding>
                    {children}
                </QuestionWrapper>
            </Tooltip>
        )
    }

    return (
        <span style={{ marginLeft: 4 }}>
            <Tooltip text={text} show={show}>
                <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
                    <SolidQuestionMarkCircleIcon width={16} height={16} />
                </QuestionWrapper>
            </Tooltip>
        </span>
    )
}

export const LightQuestionHelper = ({ text }: { text: string }) => {
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    return (
        <span style={{ marginLeft: 4 }}>
            <Tooltip text={text} show={show}>
                <LightQuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
                    <OutlineQuestionMarkCircleIcon>?</OutlineQuestionMarkCircleIcon>
                </LightQuestionWrapper>
            </Tooltip>
        </span>
    )
}

export default QuestionHelper
