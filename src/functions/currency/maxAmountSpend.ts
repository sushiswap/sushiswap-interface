import { ChainId, Currency, CurrencyAmount, JSBI } from '@sushiswap/sdk'
import { DEFAULT_ARCHER_ETH_TIP, MIN_ETH } from '../../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(
    currencyAmount?: CurrencyAmount,
    userETHTip?: string,
    chainId = ChainId.MAINNET
): CurrencyAmount | undefined {
    if (!currencyAmount) return undefined
    if (currencyAmount.currency === Currency.getNativeCurrency(chainId)) {
        if (userETHTip === undefined) {
            if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
                return CurrencyAmount.ether(
                    JSBI.subtract(currencyAmount.raw, MIN_ETH)
                )
            } else {
                return CurrencyAmount.ether(JSBI.BigInt(0))
            }
        } else {
            let ethTip = JSBI.BigInt(userETHTip)
            const ethTipWithBuffer = JSBI.divide(
                JSBI.multiply(ethTip, JSBI.BigInt(120)),
                JSBI.BigInt(100)
            )
            if (JSBI.greaterThan(currencyAmount.raw, ethTipWithBuffer)) {
                return CurrencyAmount.ether(
                    JSBI.subtract(currencyAmount.raw, ethTipWithBuffer)
                )
            } else {
                return CurrencyAmount.ether(JSBI.BigInt(0))
            }
        }
    }
    return currencyAmount
}
