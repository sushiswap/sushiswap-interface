import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Input as NumericalInput } from '../../components/NumericalInput'
import ErrorTriangle from '../../assets/images/error-triangle.svg'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { BAR_ADDRESS, Token, TokenAmount } from '@sushiswap/sdk'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useWalletModalToggle } from '../../state/application/hooks'
import { BalanceProps } from '../../hooks/useTokenBalance'
import { formatFromBalance, formatToBalance } from '../../utils'
import useSushiBar from '../../hooks/useSushiBar'
import TransactionFailedModal from './TransactionFailedModal'
import { Button, Dots } from '../../components'
import { t } from '@lingui/macro'

import sushiData from '@sushiswap/sushi-data'
import { useLingui } from '@lingui/react'

const INPUT_CHAR_LIMIT = 18

const sendTx = async (txFunc: () => Promise<any>): Promise<boolean> => {
    let success = true
    try {
        const ret = await txFunc()
        if (ret?.error) {
            success = false
        }
    } catch (e) {
        console.error(e)
        success = false
    }
    return success
}

const StyledNumericalInput = styled(NumericalInput)`
    caret-color: #e3e3e3;
`

const tabStyle =
    'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-caption2 md:text-caption'
const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
const inactiveTabStyle = `${tabStyle} text-secondary`

const buttonStyle =
    'flex justify-center items-center w-full h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring'
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-gradient-to-r from-pink-red to-light-brown hover:opacity-90`
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`

interface StakeCardProps {
    sushiBalance: BalanceProps
    xSushiBalance: BalanceProps
}

export default function StakeCard({ sushiBalance, xSushiBalance }: StakeCardProps) {
    const { i18n } = useLingui()
    const { account } = useActiveWeb3React()

    const { allowance, enter, leave } = useSushiBar()

    const [exchangeRate, setExchangeRate] = useState<any>()
    useEffect(() => {
        const fetchData = async () => {
            const results = await Promise.all([sushiData.bar.info()])
            setExchangeRate(results[0].ratio)
        }
        fetchData()
    }, [])

    const xSushiPerSushi = parseFloat(exchangeRate)

    const walletConnected = !!account
    const toggleWalletModal = useWalletModalToggle()

    const [activeTab, setActiveTab] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)

    const balance: BalanceProps = activeTab === 0 ? sushiBalance : xSushiBalance
    const formattedBalance = formatFromBalance(balance.value)

    const [input, setInput] = useState<string>('')
    const [usingBalance, setUsingBalance] = useState(false)
    const parsedInput: BalanceProps = usingBalance ? balance : formatToBalance(input !== '.' ? input : '')
    const handleInput = (v: string) => {
        if (v.length <= INPUT_CHAR_LIMIT) {
            setUsingBalance(false)
            setInput(v)
        }
    }
    const handleClickMax = () => {
        setInput(formatFromBalance(balance.value).substring(0, INPUT_CHAR_LIMIT))
        setUsingBalance(true)
    }

    const insufficientFunds = (activeTab === 0 ? sushiBalance : xSushiBalance).value.lt(parsedInput.value)
    const inputError = insufficientFunds

    const [pendingTx, setPendingTx] = useState(false)

    const buttonDisabled = !input || pendingTx || Number(input) === 0

    const handleClickButton = async () => {
        if (buttonDisabled) return

        if (!walletConnected) {
            toggleWalletModal()
        } else {
            setPendingTx(true)

            if (activeTab === 0) {
                if (Number(allowance) === 0) {
                    const success = await sendTx(() => approve())
                    if (!success) {
                        setPendingTx(false)
                        //setModalOpen(true)
                        return
                    }
                }
                const success = await sendTx(() => enter(parsedInput))
                if (!success) {
                    setPendingTx(false)
                    //setModalOpen(true)
                    return
                }
            } else if (activeTab === 1) {
                const success = await sendTx(() => leave(parsedInput))
                if (!success) {
                    setPendingTx(false)
                    //setModalOpen(true)
                    return
                }
            }

            handleInput('')
            setPendingTx(false)
        }
    }

    const [approvalState, approve] = useApproveCallback(
        new TokenAmount(
            new Token(1, '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', 18, 'SUSHI', ''),
            parsedInput.value.toString()
        ),
        BAR_ADDRESS[1]
    )

    console.log('approvalState:', approvalState, parsedInput.value.toString())

    return (
        <>
            <TransactionFailedModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
            <div className="bg-dark-900 shadow-swap-blue-glow w-full max-w-xl pt-2 pb-6 md:pb-9 px-3 md:pt-4 md:px-8 rounded">
                <div className="flex w-full h-14 bg-dark-800 rounded">
                    <div
                        className="h-full w-6/12 p-0.5"
                        onClick={() => {
                            setActiveTab(0)
                            handleInput('')
                        }}
                    >
                        <div className={activeTab === 0 ? activeTabStyle : inactiveTabStyle}>
                            <p>{i18n._(t`Stake SUSHI`)}</p>
                        </div>
                    </div>
                    <div
                        className="h-full w-6/12 p-0.5"
                        onClick={() => {
                            setActiveTab(1)
                            handleInput('')
                        }}
                    >
                        <div className={activeTab === 1 ? activeTabStyle : inactiveTabStyle}>
                            <p>{i18n._(t`Unstake`)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center w-full mt-6">
                    <p className="text-large md:text-h5 font-bold text-high-emphesis">
                        {activeTab === 0 ? i18n._(t`Stake SUSHI`) : i18n._(t`Unstake`)}
                    </p>
                    <div className="border-gradient-r-pink-red-light-brown-dark-pink-red border-transparent border-solid border rounded-3xl px-4 md:px-3.5 py-1.5 md:py-0.5 text-high-emphesis text-xs font-medium md:text-caption md:font-normal">
                        {`1 xSUSHI = ${xSushiPerSushi.toFixed(4)} SUSHI`}
                    </div>
                </div>

                <StyledNumericalInput
                    value={input}
                    onUserInput={handleInput}
                    className={`w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-caption2 md:text-lg font-bold text-dark-800${
                        inputError ? ' pl-9 md:pl-12' : ''
                    }`}
                    placeholder=" "
                />
                {/* input overlay: */}
                <div className="relative h-0 bottom-14 w-full pointer-events-none">
                    <div
                        className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${
                            inputError ? ' border border-red' : ''
                        }`}
                    >
                        <div className="flex">
                            {inputError && <img className="w-4 md:w-5 mr-2" src={ErrorTriangle} alt="error" />}
                            <p
                                className={`text-caption2 md:text-lg font-bold ${
                                    input ? 'text-high-emphesis' : 'text-secondary'
                                }`}
                            >
                                {`${input ? input : '0'} ${activeTab === 0 ? '' : 'x'}SUSHI`}
                            </p>
                        </div>
                        <div className="flex items-center text-secondary text-caption2 md:text-caption">
                            <div className={input ? 'hidden md:flex md:items-center' : 'flex items-center'}>
                                <p>{i18n._(t`Balance`)}:&nbsp;</p>
                                <p className="text-caption font-bold">{formattedBalance}</p>
                            </div>
                            <button
                                className={`
                                    pointer-events-auto
                                    focus:outline-none focus:ring hover:bg-opacity-40
                                    md:bg-cyan-blue md:bg-opacity-30
                                    border border-secondary md:border-cyan-blue
                                    rounded-2xl py-1 px-2 md:py-1 md:px-3 ml-3 md:ml-4
                                    text-xs md:text-caption2 font-bold md:font-normal md:text-cyan-blue
                                `}
                                onClick={handleClickMax}
                            >
                                {i18n._(t`MAX`)}
                            </button>
                        </div>
                    </div>
                </div>
                {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) &&
                activeTab === 0 ? (
                    <Button
                        className={`${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`}
                        disabled={approvalState === ApprovalState.PENDING}
                        onClick={approve}
                    >
                        {approvalState === ApprovalState.PENDING ? (
                            <Dots>{i18n._(t`Approving`)} </Dots>
                        ) : (
                            i18n._(t`Approve`)
                        )}
                    </Button>
                ) : (
                    <button
                        className={
                            buttonDisabled
                                ? buttonStyleDisabled
                                : !walletConnected
                                ? buttonStyleConnectWallet
                                : insufficientFunds
                                ? buttonStyleInsufficientFunds
                                : buttonStyleEnabled
                        }
                        onClick={handleClickButton}
                    >
                        {!walletConnected
                            ? i18n._(t`Connect Wallet`)
                            : !input
                            ? i18n._(t`Enter Amount`)
                            : insufficientFunds
                            ? i18n._(t`Insufficient Balance`)
                            : activeTab === 0
                            ? i18n._(t`Confirm Staking`)
                            : i18n._(t`Confirm Withdrawal`)}
                    </button>
                )}
            </div>
        </>
    )
}
