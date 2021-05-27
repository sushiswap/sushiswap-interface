import { BigNumber } from '@ethersproject/bignumber'
import { TokenAmount } from '@sushiswap/sdk'

class BentoTokenAmount extends TokenAmount {
    readonly bentoBalance: any
    readonly wallet: { value: BigNumber; string: string; usdValue: BigNumber; usd: string }
    readonly bento: { value: BigNumber; string: string; usdValue: BigNumber; usd: string }
}

export default BentoTokenAmount
