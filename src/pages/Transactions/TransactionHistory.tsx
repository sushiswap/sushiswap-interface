import React, { useContext } from 'react'
import { Currency } from '@sushiswap/sdk'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { ThemeContext } from 'styled-components'
import { CheckCircle, ArrowUpRight } from 'react-feather'
import { LinkStyledButton } from '../../theme'

type Props = {
    transactions: string[]
}

export default function TransactionHistory({ transactions }: Props) {
    const theme = useContext(ThemeContext)
    return (
        <>
            <div className="flex justify-between mb-6 flex-col sm:flex-row items-start">
                <div className="text-xl font-medium text-white">Your Transaction History</div>
                <LinkStyledButton>
                    <span className="text-sm">Clear History</span>
                </LinkStyledButton>
            </div>
            <div>
                {transactions.map(t => (
                    <div key={t} className="flex justify-between items-center rounded bg-dark-800 px-3 py-1 mb-3">
                        <DoubleCurrencyLogo
                            currency0={Currency.ETHER}
                            currency1={Currency.BNB}
                            size={30}
                            margin={true}
                        />
                        <div className="flex flex-1 items-center text-sm px-3 py-2 text-primary rounded-lg text-bold bg-dark-900">
                            <span className="mr-1">{t}</span>
                            <ArrowUpRight strokeWidth={2} size={14} color={theme.blue1} />
                        </div>
                        <div className="ml-4 mr-1">
                            <CheckCircle strokeWidth={2} size={18} color={theme.green1} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
