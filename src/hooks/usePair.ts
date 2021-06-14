import { Currency, Pair } from "@sushiswap/sdk";
import { PairState, usePairs } from "./usePairs";

export function usePair(
  tokenA?: Currency,
  tokenB?: Currency
): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0];
}
