import { ChainId, Token } from "@sushiswap/sdk";
import { Tags, TokenInfo, TokenList } from "@uniswap/token-lists";

import { AppState } from "..";
import DEFAULT_TOKEN_LIST from "@sushiswap/default-token-list";
import { UNSUPPORTED_LIST_URLS } from "../../constants/token-lists";
import UNSUPPORTED_TOKEN_LIST from "../../constants/token-lists/sushiswap-v2-unsupported.tokenlist.json";
import { sortByListPriority } from "../../functions/list";
import { useMemo } from "react";
import { useSelector } from "react-redux";

type TagDetails = Tags[keyof Tags];

export interface TagInfo extends TagDetails {
  id: string;
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo;
  public readonly tags: TagInfo[];
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(
      tokenInfo.chainId,
      tokenInfo.address,
      tokenInfo.decimals,
      tokenInfo.symbol,
      tokenInfo.name
    );
    this.tokenInfo = tokenInfo;
    this.tags = tags;
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI;
  }
}

export type TokenAddressMap = Readonly<
  {
    [chainId in ChainId]: Readonly<{
      [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList };
    }>;
  }
>;

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.KOVAN]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.ROPSTEN]: {},
  [ChainId.GÖRLI]: {},
  [ChainId.MAINNET]: {},
  [ChainId.FANTOM]: {},
  [ChainId.FANTOM_TESTNET]: {},
  [ChainId.MATIC]: {},
  [ChainId.MATIC_TESTNET]: {},
  [ChainId.XDAI]: {},
  [ChainId.BSC]: {},
  [ChainId.BSC_TESTNET]: {},
  [ChainId.ARBITRUM]: {},
  [ChainId.ARBITRUM_TESTNET]: {},
  [ChainId.MOONBEAM_TESTNET]: {},
  [ChainId.AVALANCHE]: {},
  [ChainId.AVALANCHE_TESTNET]: {},
  [ChainId.HECO]: {},
  [ChainId.HECO_TESTNET]: {},
  [ChainId.HARMONY]: {},
  [ChainId.HARMONY_TESTNET]: {},
  [ChainId.OKEX]: {},
  [ChainId.OKEX_TESTNET]: {},
};

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== "undefined"
    ? new WeakMap<TokenList, TokenAddressMap>()
    : null;

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list);
  if (result) return result;

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined;
            return { ...list.tags[tagId], id: tagId };
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? [];
      const token = new WrappedTokenInfo(tokenInfo, tags);
      if (tokenMap[token.chainId][token.address] !== undefined)
        throw Error("Duplicate tokens.");
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list: list,
          },
        },
      };
    },
    { ...EMPTY_LIST }
  );
  listCache?.set(list, map);
  return map;
}

export function useAllLists(): {
  readonly [url: string]: {
    readonly current: TokenList | null;
    readonly pendingUpdate: TokenList | null;
    readonly loadingRequestId: string | null;
    readonly error: string | null;
  };
} {
  return useSelector<AppState, AppState["lists"]["byUrl"]>(
    (state) => state.lists.byUrl
  );
}

function combineMaps(
  map1: TokenAddressMap,
  map2: TokenAddressMap
): TokenAddressMap {
  return {
    1: { ...map1[1], ...map2[1] }, // mainnet
    3: { ...map1[3], ...map2[3] }, // ropsten
    4: { ...map1[4], ...map2[4] }, // rinkeby
    5: { ...map1[5], ...map2[5] }, // goerli
    42: { ...map1[42], ...map2[42] }, // kovan
    250: { ...map1[250], ...map2[250] }, // fantom
    4002: { ...map1[4002], ...map2[4002] }, // fantom testnet
    137: { ...map1[137], ...map2[137] }, // matic
    80001: { ...map1[80001], ...map2[80001] }, // matic testnet
    100: { ...map1[100], ...map2[100] }, // xdai
    56: { ...map1[56], ...map2[56] }, // bsc
    97: { ...map1[97], ...map2[97] }, // bsc testnet
    42161: { ...map1[42161], ...map2[42161] }, // arbitrum
    79377087078960: { ...map1[79377087078960], ...map2[79377087078960] }, // arbitrum testnet
    1287: { ...map1[1287], ...map2[1287] }, // moonbase
    128: { ...map1[128], ...map2[128] }, // heco
    256: { ...map1[256], ...map2[256] }, // heco testnet
    43114: { ...map1[43114], ...map2[43114] }, // avax mainnet
    43113: { ...map1[43113], ...map2[43113] }, // avax testnet fuji
    1666600000: { ...map1[1666600000], ...map2[1666600000] }, // harmony
    1666700000: { ...map1[1666700000], ...map2[1666700000] }, // harmony testnet
    66: { ...map1[66], ...map2[66] }, // okex
    65: { ...map1[65], ...map2[65] }, // okex testnet
  };
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(
  urls: string[] | undefined
): TokenAddressMap {
  const lists = useAllLists();

  return useMemo(() => {
    if (!urls) return EMPTY_LIST;

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current;
          if (!current) return allTokens;
          try {
            const newTokens = Object.assign(listToTokenMap(current));
            return combineMaps(allTokens, newTokens);
          } catch (error) {
            console.error("Could not show token list due to error", error);
            return allTokens;
          }
        }, EMPTY_LIST)
    );
  }, [lists, urls]);
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  return useSelector<AppState, AppState["lists"]["activeListUrls"]>(
    (state) => state.lists.activeListUrls
  )?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url));
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists();
  const allActiveListUrls = useActiveListUrls();
  return Object.keys(lists).filter(
    (url) =>
      !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url)
  );
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls();
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls);
  const defaultTokenMap = listToTokenMap(DEFAULT_TOKEN_LIST);
  return combineMaps(activeTokens, defaultTokenMap);
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  const allInactiveListUrls: string[] = useInactiveListUrls();
  return useCombinedTokenMapFromUrls(allInactiveListUrls);
}

// used to hide warnings on import for default tokens
export function useDefaultTokenList(): TokenAddressMap {
  return listToTokenMap(DEFAULT_TOKEN_LIST);
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST);

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(
    UNSUPPORTED_LIST_URLS
  );

  // format into one token address map
  return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap);
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls();
  return Boolean(activeListUrls?.includes(url));
}
