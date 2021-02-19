import { useCallback } from 'react'
import { BigNumber } from 'ethers'
import { useMakerContract, useMasterChefContract, useMakerInfoContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useMaker = () => {
  const addTransaction = useTransactionAdder()
  const makerContract = useMakerContract()
  const masterChefContract = useMasterChefContract()
  const makerInfoContract = useMakerInfoContract()

  console.log('makerInfoContract:', makerInfoContract)

  // Serve
  const serve = useCallback(
    async (token0: string, token1: string) => {
      try {
        const tx = await makerContract?.methods.convert(token0, token1)
        return addTransaction(tx, { summary: 'Serve' })
      } catch (e) {
        return e
      }
    },
    [addTransaction, makerContract]
  )

  // ServeAll
  const serveAll = useCallback(async () => {
    const poolLength = await masterChefContract?.functions.poolLength()
    const pids = [...Array(poolLength - 1).keys()].filter(
      pid => pid != 29 && pid != 30 && pid != 33 && pid != 45 && pid != 61 && pid != 62 && pid != 102 && pid != 124 && pid != 125 && pid != 126 
    )
    // todo: support multi-chain:
    // usdt: mainnet: 0xdAC17F958D2ee523a2206206994597C13D831ec7, ropsten: 0x292c703A980fbFce4708864Ae6E8C40584DAF323
    const pairs = await makerInfoContract?.getPairs(
      pids,
      '0xdAC17F958D2ee523a2206206994597C13D831ec7', // usdt
      '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    )
    const pairsOrdered = [...pairs]
      .sort(
        (a: { totalValueInCurrency: string }, b: { totalValueInCurrency: string }) =>
          Number(b.totalValueInCurrency) - Number(a.totalValueInCurrency)
      )
      .slice(0, 15)

    const tokens0 = pairsOrdered.map((pair: { token0: string }) => pair.token0)
    const tokens1 = pairsOrdered.map((pair: { token1: string }) => pair.token1)

    try {
      const tx = await makerContract?.methods.convertAll(tokens0, tokens1)
      return addTransaction(tx, { summary: 'Serve' })
    } catch (e) {
      return e
    }
  }, [addTransaction, makerContract?.methods, makerInfoContract, masterChefContract?.functions])

  return { serve, serveAll }
}

export default useMaker
