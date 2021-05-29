import React, { useCallback, useEffect, useRef, FC, useMemo } from 'react'
import useWebSocket from 'react-use-websocket'
import { t } from '@lingui/macro'
import { formattedNum, priceFormatter } from '../../utils'
import { NETWORK_LABEL } from '../../constants/networks'
import { useLingui } from '@lingui/react'
import { OrderDirection, SwapMessage, SwapMessageResponse } from '../../entities/ProSwapMessages'
import useSWR from 'swr'
import withPair from '../../hoc/withPair'
import { Pair } from '@sushiswap/sdk'

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
    const { sendMessage, lastMessage } = useWebSocket('wss://ws-eu.pusher.com/app/068f5f33d82a69845215')
    const { data } = useSWR<SwapMessageResponse, Error>(
        `https://api.sushipro.io/?api_key=EatSushiIsGood&act=last_transactions&chainID=1&pair=${pair.liquidityToken.address.toLowerCase()}`
    )
    const messageHistory = useRef<SwapMessage[]>(data?.results || [])
    messageHistory.current = useMemo(() => (data ? data.results : []), [data])

    const parseMessage = useCallback(
        async (message: MessageEvent) => {
            try {
                const msg = JSON.parse(message.data)
                if ('data' in msg) {
                    const parsedData = JSON.parse(msg.data)
                    if (parsedData && parsedData.result && parsedData.result.status === 'ok') {
                        const { chainId, pair: parsedPair } = parsedData.result.data
                        if (parsedPair.toLowerCase() === pair.liquidityToken.address.toLowerCase())
                            messageHistory.current.push(
                                ...parsedData.result.data.swaps.map(
                                    ({ amountBase, side, timestamp, price, txHash }: SwapMessage) => ({
                                        chainId,
                                        amountBase,
                                        side,
                                        timestamp,
                                        price,
                                        txHash
                                    })
                                )
                            )
                    }
                }
            } catch (e) {}
        },
        [pair]
    )

    useEffect(() => {
        sendMessage(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: 'live_transactions' } }))
    }, [])

    useEffect(() => {
        if (!lastMessage) return

        parseMessage(lastMessage)
    }, [lastMessage, parseMessage])

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
                    {messageHistory.current.map(({ chainId, amountBase, side, timestamp, price, txHash }, index) => {
                        const buy = side === OrderDirection.BUY
                        return (
                            <div key={`${txHash}-${index}`} className="border-dark-850 relative">
                                <div className="grid grid-flow-col grid-cols-6 text-sm gap-2 items-center h-[32px]">
                                    <div className="text-secondary">{NETWORK_LABEL[chainId]}</div>
                                    <div className="text-secondary">{`${pair?.token0.symbol}/${pair?.token1.symbol}`}</div>
                                    <div className={`${buy ? 'text-green' : 'text-red'}`}>{side}</div>
                                    <div className="font-mono">{priceFormatter.format(price)}</div>
                                    <div className="font-mono">{formattedNum(amountBase)}</div>
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
