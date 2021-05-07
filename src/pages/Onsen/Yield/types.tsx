export type Farm = {
    symbol: string,
    address: string,
    type: string,
    token0: string,
    token1: string,
    liquidity: number,
    liquidityChange: number,
    volume: number,
    volumeChange: number,
    fees: number,
    apr: number,
    earnings?: number
}

export enum ONSEN_CATEGORY {
    ALL,
    KASHI,
    NFT_INDEX,
    BLUE_CHIP,
    NEWLY_ADDED,
    TOP_MOVER,
    STABLE_COIN,
}

export enum ONSEN_VIEWS {
    ALL_POOLS,
    USER_POOLS
}