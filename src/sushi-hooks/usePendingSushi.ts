import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks'
import { useMasterChefContract } from './useContract'
import { useBlockNumber } from 'state/application/hooks'

import Fraction from 'constants/Fraction'

const usePending = (pid: number) => {
  const [balance, setBalance] = useState<string>('0')
  const { account } = useActiveWeb3React()

  const masterChefContract = useMasterChefContract()
  const currentBlockNumber = useBlockNumber()

  const fetchPending = useCallback(async () => {
    const pending = await masterChefContract?.pendingSushi(pid, account)
    const formatted = Fraction.from(BigNumber.from(pending), BigNumber.from(10).pow(18)).toString()
    setBalance(formatted)
  }, [account, masterChefContract, pid])

  useEffect(() => {
    if (account && masterChefContract && pid) {
      fetchPending()
    }
  }, [account, currentBlockNumber, fetchPending, masterChefContract, pid])

  return balance
}

export default usePending
