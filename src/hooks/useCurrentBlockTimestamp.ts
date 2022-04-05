import { BigNumber } from '@ethersproject/bignumber'
import { useSingleCallResult } from 'app/lib/hooks/multicall'

import { useMulticall2Contract } from './useContract'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useMulticall2Contract()
  return useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0]
}
