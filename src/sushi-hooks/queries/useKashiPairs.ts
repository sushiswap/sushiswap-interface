import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useBentoBoxContract, useBentoHelperContract, useKashiPairContract } from '../useContract'

import ERC20_ABI from '../../constants/abis/erc20.json'
import KASHIPAIR_ABI from '../../constants/sushiAbis/kashipair.json'
import { isAddressString, getContract } from '../../utils'

import getOracleNames from './getOracleNames'
// import { useBlockNumber } from '../../state/application/hooks'

const useKashiPairs = () => {
  //const [balance, setBalance] = useState<number | undefined>()
  const { library, account } = useActiveWeb3React()

  const bentoHelperContract = useBentoHelperContract()
  const kashiPairContract = useKashiPairContract()
  const bentoBoxContract = useBentoBoxContract()

  //const pendingContract = usePendingContract()
  //const currentBlockNumber = useBlockNumber()

  console.log('bentoHelperContract:', bentoHelperContract, bentoBoxContract)

  const [pairs, setPairs] = useState<any>()

  const fetchLendingPairs = useCallback(async () => {
    // get TokenDetails
    const getTokenDetails = async (address: string) => {
      const addressCheckSum = isAddressString(address)
      // todo fix this null assertion
      const token = getContract(addressCheckSum, ERC20_ABI, library!, undefined)
      const data = await Promise.all(
        ['name', 'symbol', 'decimals'].map(field => {
          try {
            return token.callStatic[field]()
          } catch (e) {
            return ''
          }
        })
      )
      return { address, name: data[0], symbol: data[1], decimals: data[2] }
    }
    // get PairDetails
    const getLendingPairDetails = async (address: string) => {
      console.log('address:', address)
      const addressCheckSum = isAddressString(address)
      // todo fix this null assertion
      const pair = getContract(addressCheckSum, KASHIPAIR_ABI, library!, undefined)

      const [decimals, collateral, asset, oracle] = await Promise.all([
        pair.decimals(),
        pair.collateral(),
        pair.asset(),
        pair.oracle()
      ])

      return {
        address,
        decimals,
        collateral: await getTokenDetails(collateral),
        asset: await getTokenDetails(asset),
        oracle: {
          address: oracle,
          name: getOracleNames(oracle)
        },
        // todo: add APY
        assetAPY: '',
        collateralAPY: ''
      }
    }

    const filter = bentoBoxContract?.filters.LogDeploy(kashiPairContract?.address, null)
    const events = await bentoBoxContract?.queryFilter(filter!)

    const addresses = events?.map(event => event.args?.[2])

    const fetched = await Promise.all(
      // todo: resolve this undefined map issue
      // @ts-ignore
      addresses?.map(async (address: string) => {
        try {
          return await getLendingPairDetails(address)
        } catch (e) {
          return null
        }
      })
    )

    console.log('getLendingPairs:', fetched)
    setPairs(fetched)
    //return events?.map(event => event.args?.[2] as Address)
  }, [])

  useEffect(() => {
    if (account && bentoBoxContract && library) {
      fetchLendingPairs()
    }
  }, [account, bentoBoxContract, fetchLendingPairs, library])

  return pairs
}

export default useKashiPairs
