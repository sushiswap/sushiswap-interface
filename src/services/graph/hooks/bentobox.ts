import useSWR, { SWRConfiguration } from "swr";

import { getLendingPairSubset } from "../fetchers/bentobox";
import { useActiveWeb3React } from "../../../hooks";

export function useLendingPairSubset(
  pairAddresses,
  swrConfig: SWRConfiguration = undefined
) {
  const { chainId } = useActiveWeb3React();

  const shouldFetch = chainId && pairAddresses && pairAddresses.length;

  const res = useSWR(
    shouldFetch ? ["lendingPairSubset", chainId, pairAddresses] : null,
    (_, chainId, pairAddresses) =>
      getLendingPairSubset(chainId, { pairAddresses }),
    swrConfig
  );

  return res;
}
