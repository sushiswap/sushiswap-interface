import { State } from './types'
import React, { createContext, FC, useMemo, useEffect } from 'react'
import withPair, { WithPairProps } from '../../hoc/withPair'
import withAccount, { WithAccountProps } from '../../hoc/withAccount'
import useWebSocket from 'react-use-websocket'
import {
    useOneDayBlock,
    useSushiSwapBalances,
    useSushiSwapLiquidityTransaction,
    useTwoDayBlock,
} from '../../services/covalent/hooks'
import { useActiveWeb3React } from '../../hooks'
import { usePairData, useSwapHistory, useUserSwapHistory } from './hooks'
import { parseWebsocketMessage } from './utils'

export const initialState: State = {
    pairData: null,
    lastSwap: null,
    userSwapHistory: [],
    swapHistory: [],
    oneDayBlock: 0,
    twoDayBlock: 0,
}

export const ProContext = createContext<[State, {}]>([initialState, {}])

interface ProviderProps extends WithPairProps, WithAccountProps {
    account: string
}

const Provider: FC<ProviderProps> = ({ children, pair, account }) => {
    const { chainId } = useActiveWeb3React()
    const { sendMessage, lastMessage } = useWebSocket(
        'wss://ws-eu.pusher.com/app/068f5f33d82a69845215'
    )

    const oneDayBlock = useOneDayBlock({ chainId })
    const twoDayBlock = useTwoDayBlock({ chainId })
    const swapHistory = useSwapHistory({ pair, chainId })
    const userSwapHistory = useUserSwapHistory({ account, chainId })
    const pairData = usePairData({ pair, chainId, oneDayBlock, twoDayBlock })
    const { data: userLiquidityData } = useSushiSwapLiquidityTransaction({
        chainId,
        address: account,
    })

    const { data: userBalanceData } = useSushiSwapBalances({
        chainId,
        address: account,
    })

    console.log(userLiquidityData, userBalanceData)

    // TODO Should be per pair in backend to reduce rerenders
    useEffect(() => {
        sendMessage(
            JSON.stringify({
                event: 'pusher:subscribe',
                data: { auth: '', channel: 'live_transactions' },
            })
        )
    }, [])

    useEffect(() => {
        if (!lastMessage) return

        parseWebsocketMessage(pair, swapHistory, lastMessage)
    }, [pair, lastMessage, swapHistory])

    return (
        <ProContext.Provider
            value={useMemo(
                () => [
                    {
                        pairData,
                        lastSwap:
                            swapHistory.length > 0 ? swapHistory[0] : null,
                        swapHistory,
                        userSwapHistory,
                        oneDayBlock,
                        twoDayBlock,
                    },
                    {},
                ],
                [
                    swapHistory,
                    userSwapHistory,
                    oneDayBlock,
                    twoDayBlock,
                    pairData,
                ]
            )}
        >
            {children}
        </ProContext.Provider>
    )
}

export default withAccount(withPair(Provider))
