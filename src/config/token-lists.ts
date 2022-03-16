const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'

// used to mark unsupported tokens, these are hosted lists of unsupported tokens
/**
 * @TODO add list from blockchain association
 */
export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST]

const YEARN_LIST = 'https://yearn.science/static/tokenlist.json'
const NFTX_LIST = 'https://nftx.ethereumdb.com/v2/tokenlist/'
const SYNTHETIX_LIST = 'synths.snx.eth'
const AAVE_LIST = 'tokenlist.aave.eth'
const CMC_ALL_LIST = 'defi.cmc.eth'
const CMC_STABLECOIN = 'stablecoin.cmc.eth'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const KLEROS_LIST = 't2crtokens.eth'
export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const UMA_LIST = 'https://umaproject.org/uma.tokenlist.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'
const DHEDGE_LIST = 'https://list.dhedge.eth.link'
const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  CMC_STABLECOIN,
  UMA_LIST,
  YEARN_LIST,
  SYNTHETIX_LIST,
  WRAPPED_LIST,
  SET_LIST,
  COINGECKO_LIST,
  KLEROS_LIST,
  NFTX_LIST,
  GEMINI_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  DHEDGE_LIST,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [NFTX_LIST, YEARN_LIST, GEMINI_LIST]
