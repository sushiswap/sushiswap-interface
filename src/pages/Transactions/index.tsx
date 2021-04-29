import React from 'react'
import { Helmet } from 'react-helmet'
import { Currency } from '@sushiswap/sdk'
import { LinkStyledButton } from '../../theme'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { shortenAddress } from '../../utils'

const mock = {
    transactions: [
        'Swap 0.1234 ETH for 32.1245 SUSHI',
        'Swap 0.1235 ETH for 32.1245 SUSHI',
        'Swap 0.1236 ETH for 32.1245 SUSHI',
        'Swap 0.1237 ETH for 32.1245 SUSHI'
    ],
    liquidity: [
        'Add 0.05 WBTC & 0.05 DIGG Liquidity',
        'Add 0.06 WBTC & 0.05 DIGG Liquidity',
        'Add 0.07 WBTC & 0.05 DIGG Liquidity',
        'Add 0.08 WBTC & 0.05 DIGG Liquidity'
    ]
}

export default function Transactions() {
    return (
        <>
            <Helmet>
                <title>Transactions | Sushi</title>
            </Helmet>

            <div className="w-full max-w-2xl p-4 mb-4">
                <div className="mb-3">Go Back</div>
                <div className="text-xl font-medium">Your History & Positions</div>
            </div>

            <div className="bg-dark-900 w-full max-w-2xl rounded mb-3 p-4">
                <div className="flex justify-between">
                    <div>
                        <div>{shortenAddress('0x25E6C5A2a60c960E5b0708c9C500C89e46399E22')}</div>
                        <div className="text-sm text-gray-400 font-semibold">0.01373 ETH</div>
                    </div>
                    <div className="text-sm text-gray-400 font-semibold">
                        <div>Copy Address</div>
                        <div>View on Explorer</div>
                    </div>
                </div>
            </div>

            <div className="bg-dark-900 w-full max-w-2xl rounded p-4">
                <div className="w-auto flex justify-between items-center rounded bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto mt-3 mb-6">
                    <div className="w-3/6 p-3 text-center text-primary rounded-lg text-bold bg-dark-900">
                        Transaction History
                    </div>
                    <div className="w-3/6 p-3 text-center text-secondary rounded-lg text-sm">Liquidity Positions</div>
                </div>
                <div className="flex justify-between mb-5">
                    <div className="text-xl font-medium">Your Transaction History</div>
                    <LinkStyledButton>
                        <span className="text-sm font-semibold">Clear History</span>
                    </LinkStyledButton>
                </div>
                <div>
                    {mock.transactions.map(t => (
                        <div key={t} className="flex justify-between items-center rounded bg-dark-800 p-2 mb-3">
                            <DoubleCurrencyLogo
                                currency0={Currency.ETHER}
                                currency1={Currency.BNB}
                                size={34}
                                margin={true}
                            />
                            <div className="self-center">{t}</div>
                            <div className="self-center">icon</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
