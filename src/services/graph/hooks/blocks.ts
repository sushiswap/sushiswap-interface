import { getAverageBlockTime, getOneDayBlock } from "../fetchers";

import { useActiveWeb3React } from "../../../hooks";
import useSWR from "swr";

export function useOneDayBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React();

  const res = useSWR(
    chainId ? ["oneDayBlock", chainId] : null,
    (_, chainId) => getOneDayBlock(chainId),
    swrConfig
  );

  return res;
}

export function useAverageBlockTime(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React();

  const res = useSWR(
    chainId ? ["averageBlockTime", chainId] : null,
    (_, chainId) => getAverageBlockTime(chainId),
    swrConfig
  );

  return res;
}
