import { ChainId } from '@sushiswap/sdk';

type AddressMap = { [chainId: number]: string };

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC';

export const ARCHER_ROUTER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0x9917C083FF9FbD29Df1367FBF7F2388A9a202431',
};

/**
 * SILO
 *
 */
export const SILO_FACTORY: AddressMap = {
  [ChainId.KOVAN]: '0x06dD43F4E758c4A760B292549f2091E09Ca58517',
  [ChainId.MATIC]: '0x06dD43F4E758c4A760B292549f2091E09Ca58517',
};

export const SILO_INTEREST_RATE_MODEL: AddressMap = {
  [ChainId.KOVAN]: '0x6a5702c209029bBd7DcDb5Ae7ED9A4d95f445100',
  [ChainId.MATIC]: '0x6a5702c209029bBd7DcDb5Ae7ED9A4d95f445100',
};

export const SILO_BRIDGE: AddressMap = {
  [ChainId.KOVAN]: '0xFc230D37cDf12C72Ec60D5a3EC3677F4096ee6bf',
  [ChainId.MATIC]: '0xFc230D37cDf12C72Ec60D5a3EC3677F4096ee6bf',
};

export const SILO_ORACLE: AddressMap = {
  [ChainId.KOVAN]: '0x1fDa2729D911F4CF47aE8b3a79113E35F04A7290',
  [ChainId.MATIC]: '0x1fDa2729D911F4CF47aE8b3a79113E35F04A7290',
};

export const SILO_CHAINLINK_ORACLE: AddressMap = {
  [ChainId.KOVAN]: '0xFdDC5317614b084bfbFAcbabAB46a588c32973Bd',
  [ChainId.MATIC]: '0xFdDC5317614b084bfbFAcbabAB46a588c32973Bd',
};

export const SILO_ROUTER: AddressMap = {
  [ChainId.KOVAN]: '0x9C3C740b92698b36193C5CC831effa3421f47269',
  [ChainId.MATIC]: '0x9C3C740b92698b36193C5CC831effa3421f47269',
};

export const CHAINLINK_FEED_REGISTRY: AddressMap = {
  [ChainId.KOVAN]: '0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0',
};

/**
 * SUSHI
 *
 */
export const MINICHEF_ADDRESS: AddressMap = {
  [ChainId.MATIC]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.XDAI]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.HARMONY]: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
};

export const MASTERCHEF_V2_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d',
};

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
  [ChainId.ROPSTEN]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
};

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982',
  [ChainId.ROPSTEN]: '0x84d1f7202e0e7dac211617017ca72a2cb5e2b955',
};

export const MULTICALL2_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.ROPSTEN]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.RINKEBY]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.GÖRLI]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.KOVAN]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.ARBITRUM]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
  [ChainId.ARBITRUM_TESTNET]: '0xa501c031958F579dB7676fF1CE78AD305794d579',
  [ChainId.CELO]: '0x9aac9048fC8139667D6a2597B902865bfdc225d3',
  [ChainId.FANTOM]: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
  [ChainId.FANTOM_TESTNET]: '',
  [ChainId.MATIC]: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  [ChainId.MATIC_TESTNET]: '',
  [ChainId.XDAI]: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
  [ChainId.BSC]: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.MOONBEAM_TESTNET]: '',
  [ChainId.AVALANCHE]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.AVALANCHE_TESTNET]: '',
  [ChainId.HECO]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.HECO_TESTNET]: '',
  [ChainId.HARMONY]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.HARMONY_TESTNET]: '',
  [ChainId.OKEX]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3',
  [ChainId.OKEX_TESTNET]: '',
};
