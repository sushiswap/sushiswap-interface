import { Zero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import {
  CurrencyAmount,
  JSBI,
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  MINICHEF_ADDRESS,
  SUSHI,
} from '@sushiswap/core-sdk'
import { OLD_FARMS } from 'app/config/farms'
import {
  useMasterChefContract,
  useMasterChefV2Contract,
  useMiniChefContract,
  useOldFarmsContract,
} from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from 'app/state/multicall/hooks'
import concat from 'lodash/concat'
import zip from 'lodash/zip'
import { useCallback, useMemo } from 'react'

import { Chef } from './enum'

export function useChefContract(chef: Chef) {
  const masterChefContract = useMasterChefContract()
  const masterChefV2Contract = useMasterChefV2Contract()
  const miniChefContract = useMiniChefContract()
  const oldFarmsContract = useOldFarmsContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      [Chef.MINICHEF]: miniChefContract,
      [Chef.OLD_FARMS]: oldFarmsContract,
    }),
    [masterChefContract, masterChefV2Contract, miniChefContract, oldFarmsContract]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

export function useChefContracts(chefs: Chef[]) {
  const masterChefContract = useMasterChefContract()
  const masterChefV2Contract = useMasterChefV2Contract()
  const miniChefContract = useMiniChefContract()
  const oldFarmsContract = useOldFarmsContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
      [Chef.MINICHEF]: miniChefContract,
      [Chef.OLD_FARMS]: oldFarmsContract,
    }),
    [masterChefContract, masterChefV2Contract, miniChefContract, oldFarmsContract]
  )
  return chefs.map((chef) => contracts[chef])
}

export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined
}

export function usePendingSushi(farm) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'pendingSushi', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(SUSHI[chainId], amount) : undefined
}

export function usePendingToken(farm, contract) {
  const { account } = useActiveWeb3React()

  const args = useMemo(() => {
    if (!account || !farm) {
      return
    }
    return [String(farm.pid), String(account)]
  }, [farm, account])

  const pendingTokens = useSingleContractMultipleData(
    args ? contract : null,
    'pendingTokens',
    args.map((arg) => [...arg, '0'])
  )

  return useMemo(() => pendingTokens, [pendingTokens])
}

export function useChefPositions(contract?: Contract | null, rewarder?: Contract | null, chainId = undefined) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingSushi = useSingleContractMultipleData(args ? contract : null, 'pendingSushi', args)

  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  // const pendingTokens = useSingleContractMultipleData(
  //     rewarder,
  //     'pendingTokens',
  //     args.map((arg) => [...arg, '0'])
  // )

  const getChef = useCallback(() => {
    if (MASTERCHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF
    } else if (MASTERCHEF_V2_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF_V2
    } else if (MINICHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MINICHEF
    } else if (OLD_FARMS[chainId] === contract.address) {
      return Chef.OLD_FARMS
    }
  }, [chainId, contract])

  return useMemo(() => {
    if (!pendingSushi && !userInfo) {
      return []
    }
    return zip(pendingSushi, userInfo)
      .map((data, i) => ({
        id: args[i][0],
        pendingSushi: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
        chef: getChef(),
        // pendingTokens: data?.[2]?.result,
      }))
      .filter(({ pendingSushi, amount }) => {
        return (pendingSushi && !pendingSushi.isZero()) || (amount && !amount.isZero())
      })
  }, [args, getChef, pendingSushi, userInfo])
}

export function usePositions(chainId = undefined) {
  const [masterChefV1Positions, masterChefV2Positions, miniChefPositions] = [
    useChefPositions(useMasterChefContract(), undefined, chainId),
    useChefPositions(useMasterChefV2Contract(), undefined, chainId),
    useChefPositions(useMiniChefContract(), undefined, chainId),
  ]
  return concat(masterChefV1Positions, masterChefV2Positions, miniChefPositions)
}
