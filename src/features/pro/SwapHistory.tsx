import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { formatNumber, priceFormatter } from '../../functions'
import { NETWORK_LABEL } from '../../constants/networks'
import { useLingui } from '@lingui/react'
import { OrderDirection } from '../../entities/ProSwapMessages'
import withPair from '../../hoc/withPair'
import { Pair } from '@sushiswap/sdk'
import { useSwapHistory } from '../../context/Pro/hooks'

interface ListHeaderProps {
    className?: string
}

const ListHeader: FC<ListHeaderProps> = ({ children, className }) => {
    return (
        <div className={`flex items-center cursor-pointer hover:text-primary text-sm ${className}`}>
            <div>{children}</div>
        </div>
    )
}

interface SwapHistoryProps {
    pair: Pair
}

const SwapHistory: FC<SwapHistoryProps> = ({ pair }) => {
    const { i18n } = useLingui()
    const swapHistory = useSwapHistory()

    return (
        <div className="w-full flex flex-col divide-y h-full whitespace-nowrap">
            <div className="flex justify-between items-center grid grid-flow-col grid-cols-6 text-secondary pb-1.5 gap-2 border-dark-850">
                <ListHeader>{i18n._(t`Network`)}</ListHeader>
                <ListHeader>{i18n._(t`Symbol`)}</ListHeader>
                <ListHeader>{i18n._(t`Side`)}</ListHeader>
                <ListHeader>
                    {i18n._(t`Price`)} <span className="font-bold text-secondary text-[.625rem]">USD</span>
                </ListHeader>
                <ListHeader>
                    {i18n._(t`Size`)}{' '}
                    <span className="font-bold text-secondary text-[.625rem]">{pair?.token0.symbol}</span>
                </ListHeader>
                <ListHeader className="justify-end">{i18n._(t`Time`)}</ListHeader>
            </div>
            <div className="overflow-y-scroll border-dark-850">
                <div className="flex flex-col-reverse justify-end pb-2 divide-y">
                    {swapHistory.map(({ chainId, amountBase, side, timestamp, price, txHash }, index) => {
                        const buy = side === OrderDirection.BUY
                        return (
                            <div key={`${txHash}-${index}`} className="border-dark-850 relative">
                                <div className="grid grid-flow-col grid-cols-6 text-sm gap-2 items-center h-[32px]">
                                    <div className="text-secondary">{NETWORK_LABEL[chainId]}</div>
                                    <div className="text-secondary">{`${pair?.token0.symbol}/${pair?.token1.symbol}`}</div>
                                    <div className={`${buy ? 'text-green' : 'text-red'}`}>{side}</div>
                                    <div className="font-mono">{priceFormatter.format(price)}</div>
                                    <div className="font-mono">{formatNumber(amountBase)}</div>
                                    <div className="text-right text-secondary font-mono">
                                        {new Date(timestamp * 1000).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default withPair(SwapHistory)
