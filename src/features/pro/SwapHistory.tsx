import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { amountFormatter, priceFormatter } from '../../functions'
import { useLingui } from '@lingui/react'
import withPair, { WithPairProps } from '../../hoc/withPair'
import { usePro } from '../../context/Pro/hooks'
import { OrderDirection } from '../../context/Pro/types'

interface ListHeaderProps {
    className?: string
}

const ListHeader: FC<ListHeaderProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`flex items-center cursor-pointer hover:text-primary text-sm ${className}`}
        >
            <div>{children}</div>
        </div>
    )
}

interface SwapHistoryProps extends WithPairProps {}

const SwapHistory: FC<SwapHistoryProps> = ({ pair }) => {
    const { i18n } = useLingui()
    const [{ swapHistory }] = usePro()

    return (
        <div className="overflow-hidden h-full">
            <div className="grid grid-flow-col grid-cols-12 items-center text-secondary gap-2 h-8 px-4 border-b border-dark-850">
                <ListHeader className="col-span-4 justify-end">
                    {i18n._(t`Size`)}{' '}
                    <span className="font-bold text-secondary text-[.625rem] bg-dark-800 rounded px-1 py-0.5">
                        {pair?.token0.symbol}
                    </span>
                </ListHeader>
                <ListHeader className="col-span-4 justify-end">
                    {i18n._(t`Price`)}{' '}
                    <span className="font-bold text-secondary text-[.625rem] bg-dark-800 rounded px-1 py-0.5">
                        USD
                    </span>
                </ListHeader>
                <ListHeader className="col-span-4 justify-end">
                    {i18n._(t`Time`)}
                </ListHeader>
            </div>
            <div className="h-[calc(100%-2.5rem)] overflow-auto">
                <div className="flex flex-col px-4 py-1">
                    {swapHistory.map(
                        (
                            {
                                chainId,
                                amountBase,
                                side,
                                timestamp,
                                price,
                                txHash,
                            },
                            index
                        ) => {
                            const buy = side === OrderDirection.BUY
                            return (
                                <div
                                    key={`${txHash}-${index}`}
                                    className="grid grid-flow-col grid-cols-12 text-xs gap-2 items-center h-[20px] font-mono"
                                >
                                    <div
                                        className={`text-right col-span-4 ${
                                            buy ? 'text-green' : 'text-red'
                                        }`}
                                    >
                                        {amountFormatter.format(amountBase)}
                                    </div>
                                    <div className="col-span-4 font-mono text-right">
                                        {priceFormatter.format(price)}
                                    </div>
                                    <div className="col-span-4 text-right text-secondary font-mono whitespace-nowrap">
                                        {new Date(
                                            timestamp * 1000
                                        ).toLocaleTimeString()}
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
        </div>
    )
}

export default withPair(SwapHistory)
