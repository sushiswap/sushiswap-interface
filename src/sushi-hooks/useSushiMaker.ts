import { useCallback } from 'react'
import { BigNumber } from 'ethers'
import { useMakerContract, useMasterChefContract, useMakerInfoContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useMaker = () => {
  const addTransaction = useTransactionAdder()
  const makerContract = useMakerContract(true) // withSigner
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

  // get Maker Info
  const getMakerInfo = useCallback(async () => {
    const poolLength = await masterChefContract?.functions.poolLength()
    const pids = [...Array(poolLength - 1).keys()].filter(
      pid => ![29, 30, 33, 45, 61, 62, 102, 124, 125, 126].includes(pid)
    )
    // todo: support multi-chain:
    // usdt: mainnet: 0xdAC17F958D2ee523a2206206994597C13D831ec7, ropsten: 0x292c703A980fbFce4708864Ae6E8C40584DAF323
    const result = await makerInfoContract?.getPairs(
      pids,
      '0xdAC17F958D2ee523a2206206994597C13D831ec7', // usdt
      '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'
    )
    const ethRate = BigNumber.from(result[0])
    const pairs = result[1].map((pair: any) => {
      // Todo: declare a better Pair type
      const pairFormatted = {} as any
      pairFormatted.pair = pair.lpToken
      pairFormatted.balance = BigNumber.from(pair.makerBalance)
      pairFormatted.totalSupply = BigNumber.from(pair.totalSupply)
      pairFormatted.reserve0 = BigNumber.from(pair.reserve0)
      pairFormatted.reserve1 = BigNumber.from(pair.reserve1)
      pairFormatted.token0rate = BigNumber.from(pair.token0rate)
      pairFormatted.token1rate = BigNumber.from(pair.token1rate)
      pairFormatted.token0 = pair.token0
      pairFormatted.token1 = pair.token1
      pairFormatted.token0symbol = pair.token0symbol
      pairFormatted.token1symbol = pair.token1symbol

      pairFormatted.name = pairFormatted.token0symbol + '-' + pairFormatted.token1symbol
      pairFormatted.shareOfPool =
        pairFormatted.totalSupply && pairFormatted.totalSupply.div(BigNumber.from(10).pow(18)).toNumber() !== 0
          ? pairFormatted.balance.mul(BigNumber.from('1000000000000000000')).div(pairFormatted.totalSupply)
          : BigNumber.from(0)
      pairFormatted.totalToken0 = pairFormatted.reserve0
        .mul(pairFormatted.shareOfPool)
        .div(BigNumber.from('1000000000000000000'))
      pairFormatted.totalToken1 = pairFormatted.reserve1
        .mul(pairFormatted.shareOfPool)
        .div(BigNumber.from('1000000000000000000'))
      pairFormatted.valueToken0 =
        pairFormatted.token0rate && pairFormatted.token0rate.div(BigNumber.from(10).pow(18)).toNumber() !== 0
          ? pairFormatted.totalToken0.mul(BigNumber.from('1000000000000000000')).div(pairFormatted.token0rate)
          : BigNumber.from(0)
      pairFormatted.valueToken1 =
        pairFormatted.token1rate && pairFormatted.token1rate.div(BigNumber.from(10).pow(18)).toNumber() !== 0
          ? pairFormatted.totalToken1.mul(BigNumber.from('1000000000000000000')).div(pairFormatted.token1rate)
          : BigNumber.from(0)
      pairFormatted.valueToken0InCurrency = pairFormatted.valueToken0
        .mul(ethRate)
        .div(BigNumber.from('1000000000000000000'))
      pairFormatted.valueToken1InCurrency = pairFormatted.valueToken1
        .mul(ethRate)
        .div(BigNumber.from('1000000000000000000'))
      pairFormatted.totalValueInCurrency = pairFormatted.valueToken0InCurrency.add(pairFormatted.valueToken1InCurrency)

      return pairFormatted
    })

    return { ethRate: ethRate, pairs: pairs }
  }, [makerInfoContract, masterChefContract?.functions])

  // ServeAll
  const serveAll = useCallback(async () => {
    const info = await getMakerInfo()
    const pairsOrdered = [...info.pairs]
      .sort((a: any, b: any) => Number(b.totalValueInCurrency) - Number(a.totalValueInCurrency))
      .slice(0, 15)
    //console.log(pairsOrdered)
    const tokens0 = pairsOrdered.map((pair: { token0: string }) => pair.token0)
    const tokens1 = pairsOrdered.map((pair: { token1: string }) => pair.token1)
    try {
      const tx = await makerContract?.methods.convertAll(tokens0, tokens1)
      return addTransaction(tx, { summary: 'Serve All' })
    } catch (e) {
      return e
    }
  }, [addTransaction, getMakerInfo, makerContract?.methods])

  return { serve, serveAll }
}

export default useMaker
