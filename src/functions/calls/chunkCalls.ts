import { DEFAULT_CHUNK_GAS_REQUIRED } from './constants'

interface Bin<T> {
  calls: T[]
  cumulativeGasLimit: number
}

/**
 * Tries to pack a list of items into as few bins as possible using the first-fit bin packing algorithm
 * @param calls the calls to chunk
 * @param chunkGasLimit the gas limit of any one chunk of calls, i.e. bin capacity
 * @param defaultGasRequired the default amount of gas an individual call should cost if not specified
 */
export default function chunkCalls<T extends { gasRequired?: number }>(
  calls: T[],
  chunkGasLimit: number,
  defaultGasRequired: number = DEFAULT_CHUNK_GAS_REQUIRED
): T[][] {
  return (
    calls
      // first sort by gas required
      .sort((c1, c2) => (c2.gasRequired ?? defaultGasRequired) - (c1.gasRequired ?? defaultGasRequired))
      // then bin the calls according to the first fit algorithm
      .reduce<Bin<T>[]>((bins, call) => {
        const gas = call.gasRequired ?? defaultGasRequired
        for (const bin of bins) {
          if (bin.cumulativeGasLimit + gas <= chunkGasLimit) {
            bin.calls.push(call)
            bin.cumulativeGasLimit += gas
            return bins
          }
        }
        // didn't find a bin for the call, make a new bin
        bins.push({
          calls: [call],
          cumulativeGasLimit: gas,
        })
        return bins
      }, [])
      // pull out just the calls from each bin
      .map((b) => b.calls)
  )
}
