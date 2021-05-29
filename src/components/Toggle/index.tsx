import React, { useState } from 'react'

// import styled from 'styled-components'
import { Switch } from '@headlessui/react'
import { classNames } from '../../functions'

// const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
//     padding: 0.25rem 0.5rem;
//     border-radius: 14px;
//     // background: ${({ theme, isActive, isOnSwitch }) =>
//         isActive ? (isOnSwitch ? theme.primary1 : theme.text4) : 'none'};
//     // color: ${({ theme, isActive, isOnSwitch }) =>
//         isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3};
//     font-size: 1rem;
//     font-weight: 400;

//     padding: 0.35rem 0.6rem;
//     // border-radius: ${({ theme }) => theme.borderRadius};
//     // background: ${({ theme, isActive, isOnSwitch }) =>
//         isActive ? (isOnSwitch ? theme.primary1 : theme.text4) : 'none'};
//     // color: ${({ theme, isActive, isOnSwitch }) =>
//         isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text2};
//     font-size: 1rem;
//     font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
//     :hover {
//         // user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
//         // background: ${({ theme, isActive, isOnSwitch }) =>
//             isActive ? (isOnSwitch ? theme.primary1 : theme.text3) : 'none'};
//         // color: ${({ theme, isActive, isOnSwitch }) =>
//             isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3};
//     }
// `

// const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
//     // border-radius: ${({ theme }) => theme.borderRadius};
//     border: none;
//     // background: ${({ theme }) => theme.bg3};
//     display: flex;
//     width: fit-content;
//     cursor: pointer;
//     outline: none;
//     padding: 0;
// `

export interface ToggleProps {
    id?: string
    isActive: boolean
    toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
    return (
        <Switch
            checked={isActive}
            onChange={toggle}
            className={classNames(
                isActive ? 'bg-blue' : 'bg-dark-800',
                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
            )}
        >
            <span className="sr-only">Use setting</span>
            <span
                className={classNames(
                    isActive ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-dark-900 shadow transform ring-0 transition ease-in-out duration-200'
                )}
            >
                <span
                    className={classNames(
                        isActive
                            ? 'opacity-0 ease-out duration-100'
                            : 'opacity-100 ease-in duration-200',
                        'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                    )}
                    aria-hidden="true"
                >
                    <svg
                        className="w-3 h-3 text-low-emphesis"
                        fill="none"
                        viewBox="0 0 12 12"
                    >
                        <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <span
                    className={classNames(
                        isActive
                            ? 'opacity-100 ease-in duration-200'
                            : 'opacity-0 ease-out duration-100',
                        'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                    )}
                    aria-hidden="true"
                >
                    <svg
                        className="w-3 h-3 text-high-emphesis"
                        fill="currentColor"
                        viewBox="0 0 12 12"
                    >
                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                </span>
            </span>
        </Switch>
        // <StyledToggle id={id} isActive={isActive} onClick={toggle}>
        //     <ToggleElement isActive={isActive} isOnSwitch={true}>
        //         On
        //     </ToggleElement>
        //     <ToggleElement isActive={!isActive} isOnSwitch={false}>
        //         Off
        //     </ToggleElement>
        // </StyledToggle>
    )
}
