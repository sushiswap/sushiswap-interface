import React, { FC, useCallback, useState } from 'react'

import { QuestionMarkCircleIcon as OutlineQuestionMarkCircleIcon } from '@heroicons/react/outline'
import { QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon } from '@heroicons/react/solid'
import Tooltip from '../Tooltip'
import styled from 'styled-components'

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

const QuestionHelper: FC<{ text: any; className?: string }> = ({
    className = '',
    children,
    text,
}) => {
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    if (children) {
        return (
            <div className={className}>
                <Tooltip text={text} show={show}>
                    <div
                        className="flex items-center justify-center outline-none"
                        onClick={open}
                        onMouseEnter={open}
                        onMouseLeave={close}
                    >
                        {children}
                    </div>
                </Tooltip>
            </div>
        )
    }

    return (
        <span className={`${className} ml-1`}>
            <Tooltip text={text} show={show}>
                <div
                    className="flex items-center justify-center outline-none cursor-help hover:text-primary"
                    onClick={open}
                    onMouseEnter={open}
                    onMouseLeave={close}
                >
                    <SolidQuestionMarkCircleIcon width={16} height={16} />
                </div>
            </Tooltip>
        </span>
    )
}

export const LightQuestionHelper: FC<{ text: string; className?: string }> = ({
    text,
    className = '',
}) => {
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    return (
        <span className={`${className} ml-1`}>
            <Tooltip text={text} show={show}>
                <LightQuestionWrapper
                    onClick={open}
                    onMouseEnter={open}
                    onMouseLeave={close}
                >
                    <OutlineQuestionMarkCircleIcon>
                        ?
                    </OutlineQuestionMarkCircleIcon>
                </LightQuestionWrapper>
            </Tooltip>
        </span>
    )
}

export default QuestionHelper
