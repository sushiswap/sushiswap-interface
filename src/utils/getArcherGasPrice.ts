import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/sdk'
import { ARCHER_GAS_URI, DEFAULT_ARCHER_GAS_PRICE, GASNOW_URI } from '../constants'

/**
 * Fetches current competitive gas price estimate
 * @param quantile quantile to use in order to estimate gas price (min, q10, q25, median, q75, q90, or max)
 */
export default async function getArcherGasPrice(chainId: ChainId,
    quantile = 'median'
): Promise<BigNumber> {
    let gasPrice = DEFAULT_ARCHER_GAS_PRICE
    let json
    try {
        const gasURI = ARCHER_GAS_URI[chainId]
        if (gasURI) {
            const response = await fetch(gasURI)
            json = await response.json()
            gasPrice = BigNumber.from(json.effectiveGasPrice[quantile])
        }
        else {
            throw Error(`ARCHER_GAS_URI not defined for chainId ${chainId}`)
        }
    } catch (error) {
        try {
            const gasNowURI = GASNOW_URI[chainId]
            if (gasNowURI) {
                const response = await fetch(gasNowURI as string)
                json = await response.json()
                gasPrice = BigNumber.from(json.data.rapid).mul(2)
            }
            else {
                throw Error(`GASNOW_URI not defined for chainId ${chainId}`)
            }
        } catch (error) {
        }
    }
    return gasPrice
}
