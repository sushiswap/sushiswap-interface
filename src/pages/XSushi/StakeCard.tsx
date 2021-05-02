import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../components'
import { Input as NumericalInput } from '../../components/NumericalInput'

const tabStyle =
    'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-caption2 md:text-caption'
const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
const inactiveTabStyle = `${tabStyle} text-secondary`

const buttonStyle =
    'flex justify-center items-center w-full h-10 md:h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring'
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-gradient-to-r from-pink-red to-light-brown`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`

interface StakeCardProps {
    xSushiPerSushi: number
    sushiBalance: number
    xSushiBalance: number
}

export default function StakeCard({ xSushiPerSushi, sushiBalance, xSushiBalance }: StakeCardProps) {
    const [activeTab, setActiveTab] = useState(0)
    const [input, setInput] = useState('')

    return (
        <div className="bg-dark-900 shadow-swap-blue-glow w-full max-w-xl pt-2 pb-6 md:pb-9 px-3 md:pt-4 md:px-8 rounded">
            <div className="flex w-full h-10 md:h-14 bg-dark-800 rounded">
                <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                        setActiveTab(0)
                        setInput('')
                    }}
                >
                    <div className={activeTab === 0 ? activeTabStyle : inactiveTabStyle}>
                        <p>Stake SUSHI</p>
                    </div>
                </div>
                <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                        setActiveTab(1)
                        setInput('')
                    }}
                >
                    <div className={activeTab === 1 ? activeTabStyle : inactiveTabStyle}>
                        <p>Unstake</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center w-full mt-6">
                <p className="text-large md:text-h5 font-bold text-high-emphesis">
                    {activeTab === 0 ? 'Stake SUSHI' : 'Unstake'}
                </p>
                <div className="border-gradient-r-pink-red-light-brown-dark-pink-red border-transparent border-solid border rounded-3xl px-4 md:px-3.5 py-1.5 md:py-0.5 text-high-emphesis text-xs font-medium md:text-caption md:font-normal">
                    {`1 SUSHI = ${xSushiPerSushi.toFixed(1)} xSUSHI`}
                </div>
            </div>

            <NumericalInput
                value={input}
                onUserInput={setInput}
                className="w-full h-11 md:h-14 px-3 md:px-5 bg-dark-800 mt-5 rounded"
                placeholder=" "
            />
            <div className="relative h-0 bottom-11 md:bottom-14 w-full pointer-events-none">
                <div className="flex justify-between items-center h-11 md:h-14 px-3 md:px-5">
                    <p className="text-caption2 md:text-lg font-bold text-secondary">{!input ? '0 SUSHI' : ''}</p>
                    <div className="pointer-events-auto flex items-center text-secondary text-caption2 md:text-caption">
                        <p>Balance:&nbsp;</p>
                        <p className="text-caption font-bold">
                            {(activeTab === 0 ? sushiBalance : xSushiBalance).toPrecision(6)}
                        </p>
                        <button
                            className={`
                                focus:outline-none focus:ring hover:bg-opacity-40
                                md:bg-cyan-blue md:bg-opacity-30
                                border border-secondary md:border-cyan-blue
                                rounded-2xl py-1 px-2 md:py-1 md:px-3 ml-3 md:ml-4
                                text-xs md:text-caption2 font-bold md:font-normal md:text-cyan-blue
                            `}
                            onClick={() => setInput((activeTab === 0 ? sushiBalance : xSushiBalance).toString())}
                        >
                            MAX
                        </button>
                    </div>
                </div>
            </div>

            <button className={input ? buttonStyleEnabled : buttonStyleDisabled}>
                {!input ? 'Enter Amount' : activeTab === 0 ? 'Confirm Staking' : 'Confirm Withdrawal'}
            </button>
        </div>
    )
}
