import { Paper } from 'kashi'
import React from 'react'
import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import SushiDepositPanel from './SushiDepositPanel'
import XSushiWithdrawlPanel from './XSushiWithdrawlPanel'

export default function SushiBar() {
    const { account } = useActiveWeb3React()
    return (
        <div className="flex flex-col max-w-md w-full mx-auto">
            <Paper className="bg-dark-800 p-4 space-y-4 ">
                <div className="text-lg font-bold text-primary mb-2">SushiBar: Make SUSHI work for you</div>
                <div className="text-sm text-secondary">
                    <p className="mb-4">
                        Stake your SUSHI into xSUSHI for ~5% APY. No impermanent loss, no loss of governance rights.
                        Continuously compounding.
                    </p>
                    <p>
                        xSUSHI automatically earn fees (0.05% of all swaps, including multichain swaps) proportional to
                        your share of the SushiBar.
                    </p>
                </div>
                <div className="flex justify-between my-2">
                    <a
                        style={{ color: 'white', textDecoration: 'underline' }}
                        target="_blank"
                        rel="noreferrer"
                        href="https://analytics.sushi.com/bar"
                    >
                        View SushiBar Stats <span style={{ fontSize: '11px' }}>↗</span>
                    </a>
                    {account && (
                        <a
                            style={{ color: 'white', textDecoration: 'underline' }}
                            target="_blank"
                            rel="noreferrer"
                            href={'http://analytics.sushi.com/users/' + account}
                        >
                            View your SushiBar Portfolio <span style={{ fontSize: '11px' }}>↗</span>
                        </a>
                    )}
                </div>
            </Paper>
            <Paper className="max-w-md w-full mx-auto">
                <div className="text-center text-lg text-bold my-4">SUSHI → xSUSHI</div>
                <SushiDepositPanel
                    label={''}
                    disableCurrencySelect={true}
                    customBalanceText={'Available to deposit: '}
                    id="stake-liquidity-token"
                    buttonText="Deposit"
                    cornerRadiusBottomNone={true}
                />
                <XSushiWithdrawlPanel
                    label={''}
                    disableCurrencySelect={true}
                    customBalanceText={'Available to withdraw: '}
                    id="withdraw-liquidity-token"
                    buttonText="Withdraw"
                    cornerRadiusTopNone={true}
                />
            </Paper>
        </div>
    )
}
