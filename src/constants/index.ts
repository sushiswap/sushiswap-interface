import { ChainId, JSBI, Percent } from '@sushiswap/sdk';
import { binance, fortmatic, injected, portis, torus, walletconnect, walletlink, keystone } from '../connectors';

import { AbstractConnector } from '@web3-react/abstract-connector';
import { BigNumber } from 'ethers';

export const APP_NAME_URL = 'silo.finance';
export const APP_NAME = 'SILO';
export const APP_SHORT_BLURB = 'Enabling lending and borrowing of any asset';

/**
 * Static Oracle Lookups
 */

export const KOVAN_TOKEN_PRICEFEED_MAP: { [key: string]: string } = {
  '0xa36085f69e2889c224210f603d836748e7dc0088': '0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0', //KOVAN LINK-> KOVAN LINK/USD
  // '0x22f1ba6dB6ca0A065e1b7EAe6FC22b7E675310EF': '0xdc3ea94cd0ac27d9a86c180091e7f78c683d3699',  //KOVAN SNX -> ''
  // '0xb597cd8d3217ea6477232f9217fa70837ff667af': '0x547a514d5e3769680ce22b2361c10ea13619e8a9',  //KOVAN AAVE
  // '0x61460874a7196d6a22d1ee4922473664b3e95270': '0xdbd020caef83efd542f4de03e3cf0c28a4428bd5',  //KOVAN COMP
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': '0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39', //KOVAN UNI
  // '0xac94ea989f6955c67200dd67f0101e1865a560ea': '0xec1d1b3b0443256cc3860e24a46f108e699484aa',  //KOVAN MKR
  // '0x33a368b290589ce8cf781ab4331fe52e77478736': '0xcc70f09a6cc17553b2e31954cd36e4a2d89501f7',  //KOVAN SUSHI
};

export const MATIC_TOKEN_PRICEFEED_MAP: { [key: string]: string } = {
  '0xb0897686c545045afc77cf20ec7a532e3120e0f1': '0xd9FFdb71EbE7496cC440152d43986Aae0AB76665', //MATIC LINK -> MATIC LINK/USD
  '0xb33eaad8d922b1083446dc23f610c2567fb5180f': '0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C', //MATIC UNI -> ''
};

export const PRICE_FEED_MAP = {
  [ChainId.KOVAN]: KOVAN_TOKEN_PRICEFEED_MAP,
  [ChainId.MATIC]: MATIC_TOKEN_PRICEFEED_MAP,
};

/**
 * SILO theGraph endpoints
 */
//  export const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/9379/silo/0.13';

export const GRAPH_ENDPOINT = {
  [ChainId.KOVAN]: 'https://api.studio.thegraph.com/query/9379/silo/0.15.k',
  [ChainId.MATIC]: 'https://api.studio.thegraph.com/query/9379/silo/0.15.m',
};

/**
 * ! ONLY RINKEBY & KOVAN SETUP on ALCHEMY!
 */
export const RPC = {
  [ChainId.MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
  [ChainId.ROPSTEN]: 'https://eth-ropsten.alchemyapi.io/v2/cidKix2Xr-snU3f6f6Zjq_rYdalKKHmW',
  [ChainId.RINKEBY]: 'https://eth-rinkeby.alchemyapi.io/v2/UgPzeLM40RhClPKr7EDIFpgCDdZqEP90',
  [ChainId.GÖRLI]: 'https://eth-goerli.alchemyapi.io/v2/Dkk5d02QjttYEoGmhZnJG37rKt8Yl3Im',
  [ChainId.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/GbSmjHTvEBmpw1xCqYRViOUCHIIDWinR',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com',
  // [ChainId.MATIC]:
  //     'https://apis.ankr.com/e22bfa5f5a124b9aa1f911b742f6adfe/c06bb163c3c2a10a4028959f4d82836d/polygon/full/main',
  [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.MOONBEAM_TESTNET]: 'https://rpc.testnet.moonbeam.network',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.AVALANCHE_TESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com',
  [ChainId.HARMONY]: 'https://api.harmony.one',
  [ChainId.HARMONY_TESTNET]: 'https://api.s0.b.hmny.io',
  [ChainId.OKEX]: 'https://exchainrpc.okex.org',
  [ChainId.OKEX_TESTNET]: 'https://exchaintestrpc.okex.org',
  [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
};

export const POOL_DENY = ['14', '29', '45', '30'];

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13;

export const ARCHER_RELAY_URI: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'https://api.archerdao.io/v1/transaction',
};

export const ARCHER_GAS_URI: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'https://api.archerdao.io/v1/gas',
};

// export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
//     // [UNI_ADDRESS]: 'UNI',
//     [TIMELOCK_ADDRESS]: 'Timelock',
// }

// TODO: update weekly with new constant
export const MERKLE_ROOT =
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-13/merkle-10959148-11550728.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-14/merkle-10959148-11596364.json'
  //'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-15/merkle-10959148-11641996.json'
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-16/merkle-10959148-11687577.json';

// /**
//  * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
//  * tokens.
//  */
// export const CUSTOM_BASES: {
//     [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
// } = {
//     [ChainId.MAINNET]: {
//         [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
//         [DUCK.address]: [USDP, WETH[ChainId.MAINNET]],
//         [BAB.address]: [BAC, WETH[ChainId.MAINNET]],
//         [HBTC.address]: [CREAM, WETH[ChainId.MAINNET]],
//         [FRAX.address]: [FXS, WETH[ChainId.MAINNET]],
//         [IBETH.address]: [ALPHA, WETH[ChainId.MAINNET]],
//         [PONT.address]: [PWING, WETH[ChainId.MAINNET]],
//         [UMA_CALL.address]: [UMA, WETH[ChainId.MAINNET]],
//         [PLAY.address]: [DOUGH, WETH[ChainId.MAINNET]],
//         [XSUSHI_CALL.address]: [XSUSHI, WETH[ChainId.MAINNET]],
//     },
// }

export interface WalletInfo {
  connector?: (() => Promise<AbstractConnector>) | AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'injected.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'wallet-connect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  // KEYSTONE: {
  //   connector: keystone,
  //   name: 'Keystone',
  //   iconName: 'keystone.png',
  //   description: 'Connect to Keystone hardware wallet.',
  //   href: null,
  //   color: '#4196FC',
  //   mobile: true,
  // },
  // LATTICE: {
  //   connector: async () => {
  //     const LatticeConnector = (await import('@web3-react/lattice-connector')).LatticeConnector;
  //     return new LatticeConnector({
  //       chainId: 1,
  //       url: RPC[ChainId.MAINNET],
  //       appName: 'SushiSwap',
  //     });
  //   },
  //   name: 'Lattice',
  //   iconName: 'lattice.png',
  //   description: 'Connect to GridPlus Wallet.',
  //   href: null,
  //   color: '#40a9ff',
  //   mobile: true,
  // },
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbase.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5',
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbase.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true,
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmatic.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true,
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portis.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true,
  // },
  // Torus: {
  //   connector: torus,
  //   name: 'Torus',
  //   iconName: 'torus.png',
  //   description: 'Login using Torus hosted wallet',
  //   href: null,
  //   color: '#315CF5',
  //   mobile: true,
  // },
  // Binance: {
  //   connector: binance,
  //   name: 'Binance',
  //   iconName: 'bsc.jpg',
  //   description: 'Login using Binance hosted wallet',
  //   href: null,
  //   color: '#F0B90B',
  //   mobile: true,
  // },
};

export const NetworkContextName = 'NETWORK';

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30;

// default archer gas estimate, 250k wei
export const DEFAULT_ARCHER_GAS_ESTIMATE: BigNumber = BigNumber.from(250000);
// default gas prices to use if all other sources unavailable
export const DEFAULT_ARCHER_GAS_PRICES: BigNumber[] = [
  BigNumber.from(60000000000),
  BigNumber.from(70000000000),
  BigNumber.from(100000000000),
  BigNumber.from(140000000000),
  BigNumber.from(300000000000),
  BigNumber.from(800000000000),
  BigNumber.from(2000000000000),
];
// default miner tip, equal to median gas price * default gas estimate
export const DEFAULT_ARCHER_ETH_TIP: JSBI = JSBI.BigInt(
  DEFAULT_ARCHER_GAS_ESTIMATE.mul(DEFAULT_ARCHER_GAS_PRICES[4]).toString()
);

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 ETH

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));

export const ZERO_PERCENT = new Percent('0');
export const ONE_HUNDRED_PERCENT = new Percent('1');

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
];

// BentoBox Swappers
export const BASE_SWAPPER: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x0',
  [ChainId.ROPSTEN]: '0xe4E2540D421e56b0B786d40c5F5268891288c6fb',
};

// Boring Helper
// export const BORING_HELPER_ADDRESS = '0x11Ca5375AdAfd6205E41131A4409f182677996E6'

export const ANALYTICS_URL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'https://analytics.sushi.com',
  [ChainId.MATIC]: 'https://analytics-polygon.sushi.com',
  [ChainId.FANTOM]: 'https://analytics-ftm.sushi.com',
  [ChainId.BSC]: 'https://analytics-bsc.sushi.com',
  [ChainId.XDAI]: 'https://analytics-xdai.sushi.com',
  [ChainId.HARMONY]: 'https://analytics-harmony.sushi.com',
  [ChainId.ARBITRUM]: undefined,
};

export const EIP_1559_ACTIVATION_BLOCK: { [chainId in ChainId]?: number } = {
  [ChainId.ROPSTEN]: 10499401,
  [ChainId.GÖRLI]: 5062605,
  [ChainId.RINKEBY]: 8897988,
};

export * from './routing';
export * from './addresses';
export * from './tokens';
