import React, { FC } from 'react'
import { formatNumber } from '../../functions'
import { ArrowRight } from 'react-feather'
import withAccount from '../../hoc/withAccount'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NETWORK_LABEL } from '../../constants/networks'
import { useUserSwapHistory } from '../../context/Pro/hooks'
import { OrderDirection } from "../../context/Pro/types";

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

interface UserSwapHistoryProps {
    account: string
}

const UserSwapHistory: FC<UserSwapHistoryProps> = ({ account }) => {
    const { i18n } = useLingui()
    const userSwapHistory = useUserSwapHistory()

    return (
        <div className="w-full flex flex-col divide-y h-full">
            <div className="flex justify-between items-center grid grid-flow-col grid-cols-6 text-secondary pb-1.5 gap-2 border-dark-850">
                <ListHeader>{i18n._(t`Network`)}</ListHeader>
                <ListHeader>{i18n._(t`Symbol`)}</ListHeader>
                <ListHeader className="col-span-2">{i18n._(t`Size`)}</ListHeader>
                <ListHeader>
                    {i18n._(t`Price`)} <span className="font-bold text-secondary text-[.625rem]">USD</span>
                </ListHeader>
                <ListHeader className="justify-end">{i18n._(t`Time`)}</ListHeader>
            </div>
            <div className="overflow-y-scroll border-dark-850">
                <div className="flex flex-col-reverse justify-end pb-2 divide-y">
                    {userSwapHistory.map(
                        (
                            {
                                tokenBase,
                                tokenQuote,
                                chainId,
                                amountBase,
                                amountQuote,
                                side,
                                timestamp,
                                price,
                                priceBase,
                                txHash,
                                pairName,
                                volumeUSD,
                            },
                            index
                        ) => {
                            const buy = side === OrderDirection.BUY
                            return (
                                <div key={`${txHash}-${index}`} className="border-dark-850 relative">
                                    <div className="grid grid-flow-col grid-cols-6 text-sm gap-2 items-center h-[32px]">
                                        <div className="text-secondary">{NETWORK_LABEL[chainId]}</div>
                                        <div className="text-secondary">{pairName}</div>
                                        <div className="col-span-2 font-mono text-high-emphesis flex gap-2 items-center">
                                            <span className="flex items-baseline gap-2">
                                                {formatNumber(amountBase)}{' '}
                                                <span className="font-bold text-secondary text-[.625rem]">
                                                    {tokenBase}
                                                </span>
                                            </span>{' '}
                                            <span className={`${buy ? 'text-green' : 'text-red'} font-bold`}>
                                                <ArrowRight width={14} />
                                            </span>{' '}
                                            <span className="flex items-baseline gap-2">
                                                {formatNumber(amountQuote)}{' '}
                                                <span className="font-bold text-secondary text-[.625rem]">
                                                    {tokenQuote}
                                                </span>
                                            </span>{' '}
                                        </div>
                                        <div className="font-mono text-high-emphesis">
                                            {formatNumber(+volumeUSD / +amountBase, true)}
                                        </div>
                                        <div className="text-right font-mono text-sm text-secondary">
                                            {new Date(timestamp * 1000).toLocaleString()}
                                        </div>
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

export default withAccount(UserSwapHistory)
