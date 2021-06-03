import { SwapMessage } from './types'
import { Pair } from '@sushiswap/sdk'

export const parseWebsocketMessage = async (
    pair: Pair,
    history: SwapMessage[],
    message: MessageEvent
) => {
    try {
        const msg = JSON.parse(message.data)
        if ('data' in msg) {
            const parsedData = JSON.parse(msg.data)
            if (
                parsedData &&
                parsedData.result &&
                parsedData.result.status === 'ok'
            ) {
                const { chainId, pair: parsedPair } = parsedData.result.data
                if (
                    parsedPair.toLowerCase() ===
                    pair.liquidityToken.address.toLowerCase()
                )
                    history.push(
                        ...parsedData.result.data.swaps.map(
                            ({
                                amountBase,
                                side,
                                timestamp,
                                price,
                                txHash,
                            }: SwapMessage) => ({
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
}
