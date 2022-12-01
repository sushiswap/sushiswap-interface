// TODO (amiller68): Add tokens and change to Filecoin mainenet
const FIGSWAP_LIST =
  'https://raw.githubusercontent.com/banyancomputer/interface/wrap-time/.github/figswap-token-list.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [
  FIGSWAP_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [FIGSWAP_LIST]
