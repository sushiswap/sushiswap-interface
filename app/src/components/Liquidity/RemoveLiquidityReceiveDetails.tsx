import { Currency, NATIVE, WETH, currencyEquals } from '@sushiswap/sdk'

import { AutoColumn } from '../../components/Column'
import CurrencyLogo from '../../components/CurrencyLogo'
import Link from 'next/link'
import React from 'react'
import { RowBetween } from '../../components/Row'
import { currencyId } from '../../functions/currency'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

interface RemoveLiquidityReceiveDetailsProps {
    currencyA?: Currency
    amountA: string
    currencyB?: Currency
    amountB: string
    hasWETH: Boolean
    hasETH: Boolean
    id: string
}

export default function RemoveLiquidityReceiveDetails({
    currencyA,
    amountA,
    currencyB,
    amountB,
    hasWETH,
    hasETH,
    id
}: RemoveLiquidityReceiveDetailsProps) {
    const { chainId } = useActiveWeb3React()
    if (!chainId || !currencyA || !currencyB) throw new Error('missing dependencies')
    return (
        <div id={id} className="rounded bg-dark-800 p-5">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between">
                <div className="w-full sm:w-2/5 text-white" style={{ margin: 'auto 0px' }}>
                    <AutoColumn>
                        <div>You Will Receive:</div>
                        <RowBetween className="text-sm">
                            {hasWETH ? (
                                <Link
                                    href={`/remove/${
                                        currencyA === NATIVE ? WETH[chainId].address : currencyId(currencyA)
                                    }/${currencyB === NATIVE ? WETH[chainId].address : currencyId(currencyB)}`}
                                >
                                    <a>Receive W{Currency.getNativeCurrencySymbol(chainId)}</a>
                                </Link>
                            ) : hasETH ? (
                                <Link
                                    href={`/remove/${
                                        currencyA && currencyEquals(currencyA, WETH[chainId])
                                            ? 'ETH'
                                            : currencyId(currencyA)
                                    }/${
                                        currencyB && currencyEquals(currencyB, WETH[chainId])
                                            ? 'ETH'
                                            : currencyId(currencyB)
                                    }`}
                                >
                                    <a>Receive {Currency.getNativeCurrencySymbol(chainId)}</a>
                                </Link>
                            ) : null}
                        </RowBetween>
                    </AutoColumn>
                </div>
                {/* <RowBetween className="space-x-6"> */}
                <div className="flex flex-col space-y-3 md:flex-row md:space-x-6 md:space-y-0">
                    <div className="flex flex-row items-center rounded bg-dark-900 w-full p-3">
                        <CurrencyLogo currency={currencyA} size="46px" style={{ marginRight: '12px' }} />
                        <AutoColumn>
                            <div className="text-white">{amountA}</div>
                            <div className="text-sm">{currencyA?.getSymbol(chainId)}</div>
                        </AutoColumn>
                    </div>
                    <div className="flex flex-row items-center rounded bg-dark-900 w-full p-3">
                        <CurrencyLogo currency={currencyB} size="46px" style={{ marginRight: '12px' }} />
                        <AutoColumn>
                            <div className="text-white">{amountB}</div>
                            <div className="text-sm">{currencyB?.getSymbol(chainId)}</div>
                        </AutoColumn>
                    </div>
                </div>
                {/* </RowBetween> */}
            </div>
        </div>
    )
}
