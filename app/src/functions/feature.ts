import { ChainId } from '@sushiswap/sdk'

export enum Feature {
    AMM = 'AMM',
    AMM_V2 = 'AMM V2',
    LIQUIDITY_MINING = 'Liquidity Mining',
    BENTOBOX = 'BentoBox',
    KASHI = 'Kashi',
    MISO = 'MISO',
    ANALYTICS = 'Analytics'
}

const features = {
    [ChainId.MAINNET]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI],
    [ChainId.ROPSTEN]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI],
    [ChainId.RINKEBY]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI],
    [ChainId.GÖRLI]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI],
    [ChainId.KOVAN]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI],
    [ChainId.BSC]: [Feature.AMM, Feature.BENTOBOX, Feature.KASHI],
    [ChainId.BSC_TESTNET]: [Feature.AMM],
    [ChainId.FANTOM]: [Feature.AMM],
    [ChainId.FANTOM_TESTNET]: [Feature.AMM],
    [ChainId.MATIC]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI],
    [ChainId.MATIC_TESTNET]: [Feature.AMM],
    [ChainId.HARMONY]: [Feature.AMM],
    [ChainId.HARMONY_TESTNET]: [Feature.AMM],
    [ChainId.AVALANCHE]: [Feature.AMM],
    [ChainId.AVALANCHE_TESTNET]: [Feature.AMM],
    [ChainId.OKEX]: [Feature.AMM],
    [ChainId.OKEX_TESTNET]: [Feature.AMM],
    [ChainId.XDAI]: [Feature.AMM]
}

export function featureEnabled(feature: Feature, chainId: ChainId): boolean {
    return features[chainId].includes(feature)
}
