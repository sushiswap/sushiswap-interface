import { useCallback } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import { useDashboardContract, useDashboard2Contract } from './useContract'
import { useActiveWeb3React } from '../hooks/index'
import { ChainId } from '@sushiswap/sdk'

const useDashboard = () => {
  const { account, chainId } = useActiveWeb3React()
  const dashboardContract = useDashboardContract()
  const dashboard2Contract = useDashboard2Contract()

  // Find Balances
  const find = useCallback(async () => {
    // todo: will need to refactor out of useActiveWeb3React dep
    if (account) {
      const factory = (
        await dashboardContract?.getFactoryInfo([
          chainId == ChainId.MAINNET
            ? '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'
            : '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
        ])
      )[0]

      const poolsInfo = await dashboard2Contract?.getPools([])

      console.log('factory:', factory, BigNumber.from(factory.allPairsLength).toNumber(), dashboardContract)
      console.log('poolsInfo:', poolsInfo)

      // Find all Pairs
      // run through all pairs in increments
      // todo: refactor for efficiency
      const assets = [] as any
      const stepsize = 3333
      for (let b = 0; b <= BigNumber.from(factory.allPairsLength).toNumber() / stepsize; b++) {
        const pairs = await dashboardContract?.findPairs(
          account,
          factory.factory,
          b * stepsize,
          [BigNumber.from(factory.allPairsLength).toNumber(), (b + 1) * stepsize].reduce((m, e) => (e < m ? e : m))
        )
        pairs.map((pair: { token: string; token0: any; token1: any }) => {
          assets.push({
            name: null,
            symbol: null,
            address: pair.token + '_slp',
            token0asset: pair.token0,
            token1asset: pair.token1,
            decimals: 18,
            factory: factory.factory,
            view: 'slp'
          })
        })
      }

      // Find all Pools
      const pids = [...Array(poolsInfo[0].poolLength - 1).keys()].filter(
        pid => ![29, 30, 33, 45, 61, 62, 102, 124, 125, 126].includes(pid)
      )
      const pools = await dashboard2Contract?.findPools(account, pids)
      pools.map((pool: { pid: string; allocPoint: any; lpToken: any; token0: any; token1: any }) => {
        assets.push({
          pid: pool.pid,
          allocPoint: BigNumber.from(pool.allocPoint),
          address: pool.pid + '_pid_staked',
          name: null,
          symbol: null,
          decimals: null,
          lpToken: pool.lpToken,
          token0asset: pool.token0,
          token1asset: pool.token1,
          view: 'slp',
          staked: true
        })
      })

      console.log('assets:', assets)
      return assets
    }
    return []
  }, [account, chainId, dashboard2Contract, dashboardContract])

  return { find }
}

export default useDashboard
