import { State, SwapMessage, SwapMessageResponse, UserHistoryMessage, UserHistoryResponse } from './types'
import React, { createContext, FC, useMemo, useEffect, useRef, useCallback } from 'react'
import withPair, { WithPairProps } from '../../hoc/withPair'
import { Pair } from '@sushiswap/sdk'
import withAccount, { WithAccountProps } from '../../hoc/withAccount'
import useWebSocket from 'react-use-websocket'
import useSWR from 'swr'

export const initialState: State = {
    userHistory: [],
    swapHistory: [],
}

export const ProContext = createContext<[State, {}]>([initialState, {}])

interface ProviderProps extends WithPairProps, WithAccountProps {
    account: string
}

const Provider: FC<ProviderProps> = ({ children, pair, account }) => {
    const { sendMessage, lastMessage } = useWebSocket('wss://ws-eu.pusher.com/app/068f5f33d82a69845215')

    // Get history swaps
    const { data: swapHistoryData } = useSWR<SwapMessageResponse, Error>(
        `https://api.sushipro.io/?api_key=EatSushiIsGood&act=last_transactions&chainID=1&pair=${pair.liquidityToken.address.toLowerCase()}`
    )

    // Get user swaps
    const { data: userHistoryData } = useSWR<UserHistoryResponse, Error>(
        `https://api.sushipro.io/?api_key=EatSushiIsGood&act=user_transactions&chainID=1&address=${account.toLowerCase()}`
    )

    const userHistory = useRef<UserHistoryMessage[]>()
    userHistory.current = useMemo(() => (userHistoryData ? userHistoryData.results : []), [userHistoryData])

    const swapHistory = useRef<SwapMessage[]>(swapHistoryData?.results || [])
    swapHistory.current = useMemo(() => (swapHistoryData ? swapHistoryData.results : []), [swapHistoryData])

    const parseMessage = useCallback(
        async (message: MessageEvent) => {
            try {
                const msg = JSON.parse(message.data)
                if ('data' in msg) {
                    const parsedData = JSON.parse(msg.data)
                    if (parsedData && parsedData.result && parsedData.result.status === 'ok') {
                        const { chainId, pair: parsedPair } = parsedData.result.data
                        if (parsedPair.toLowerCase() === pair.liquidityToken.address.toLowerCase())
                            swapHistory.current.push(
                                ...parsedData.result.data.swaps.map(
                                    ({ amountBase, side, timestamp, price, txHash }: SwapMessage) => ({
                                        chainId,
                                        amountBase,
                                        side,
                                        timestamp,
                                        price,
                                        txHash,
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
        <ProContext.Provider value={[{ swapHistory: swapHistory.current, userHistory: userHistory.current }, {}]}>
            {children}
        </ProContext.Provider>
    )
}

export default withAccount(withPair(Provider))
