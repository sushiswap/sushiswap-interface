import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCloneRewarderContract, useComplexRewarderContract } from '../../hooks/useContract'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@sushiswap/sdk'
import { Chef } from './enum'
import Fraction from '../../entities/Fraction'
import { getContract } from '../../functions'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useBlockNumber } from '../../state/application/hooks'

const REWARDERS = {
  [ChainId.MAINNET]: 'some',
  [ChainId.MATIC]: 'some',
}

// const useRewarderContract = (farm) => {
//     const { chainId } = useActiveWeb3React()
//     const aclxRewarder = useAlcxRewarderContract()
//     const useComplexRewarderContract = useComplexRewarderContract()
//     // const rewarderContract = await getContract(
//     //     rewarderAddress ? rewarderAddress : undefined,
//     //     ALCX_REWARDER_ABI,
//     //     library!,
//     //     undefined
//     // )
// }

const usePending = (farm) => {
  const [balance, setBalance] = useState<string>('0')

  const { chainId, account, library } = useActiveWeb3React()
  const currentBlockNumber = useBlockNumber()

  const cloneRewarder = useCloneRewarderContract(farm?.rewarder?.id)

  const complexRewarder = useComplexRewarderContract(farm?.rewarder?.id)

  const contract = useMemo(
    () => ({
      [ChainId.MAINNET]: cloneRewarder,
      [ChainId.MATIC]: complexRewarder,
      [ChainId.XDAI]: complexRewarder,
      [ChainId.HARMONY]: complexRewarder,
      [ChainId.ARBITRUM]: cloneRewarder,
      [ChainId.CELO]: complexRewarder,
      [ChainId.MOONRIVER]: complexRewarder,
    }),
    [complexRewarder, cloneRewarder]
  )

  useEffect(() => {
    async function fetchPendingReward() {
      try {
        const pending = await contract[chainId]?.pendingTokens(farm.id, account, '0')
        // console.log({ farm })
        // todo: do not assume [0] or that rewardToken has 18 decimals (only works w/ mastechefv2 currently)
        const formatted = farm.rewardToken
          ? Fraction.from(
              BigNumber.from(pending?.rewardAmounts[0]),
              BigNumber.from(10).pow(farm.rewardToken.decimals || 18)
            ).toString(farm.rewardToken.decimals || 18)
          : Fraction.from(BigNumber.from(pending?.rewardAmounts[0]), BigNumber.from(10).pow(18)).toString(18)
        setBalance(formatted)
      } catch (error) {
        console.error(error)
      }
    }
    // id = 0 is evaluated as false
    if (
      account &&
      cloneRewarder &&
      farm &&
      library &&
      (farm.chef === Chef.MASTERCHEF_V2 || farm.chef === Chef.MINICHEF)
    ) {
      fetchPendingReward()
    }
  }, [account, currentBlockNumber, cloneRewarder, complexRewarder, farm, library, contract, chainId])

  return balance
}

export default usePending
