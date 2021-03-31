import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import {
  useBentoBoxContract,
  useKashiPairContract,
  useKashiPairHelperContract
} from './useContract'
import ERC20_ABI from 'constants/abis/erc20.json'
import { isAddressString, getContract } from 'utils'
import { BigNumber } from '@ethersproject/bignumber'
import sushiData from '@sushiswap/sushi-data'
import { getMainnetAddress } from 'kashi/functions'
import useTransactionStatus from './useTransactionStatus'
import Fraction from 'constants/Fraction'
import _ from 'lodash'

import { CLONE_ADDRESSES } from 'kashi/constants'
import { useBoringHelperContract } from 'hooks/useContract'

const useBentoBalances = () => {
  const { chainId, library, account } = useActiveWeb3React()

  const boringHelperContract = useBoringHelperContract()
  const bentoBoxContract = useBentoBoxContract()
  const kashiPairContract = useKashiPairContract()
  const kashiPairHelperContract = useKashiPairHelperContract()

  const currentTransactionStatus = useTransactionStatus()

  const [balances, setBalances] = useState<any>()
  const fetchBentoBalances = useCallback(async () => {
    // Todo:
    // Eventhough you can add and approve any erc20 token into Bentbox,
    // In the beginning we fetch all pairs on Kashi and determine the tokens that make sense to be deposited
    console.log('Before log deploy...')
    const filter = bentoBoxContract?.filters.LogDeploy(kashiPairContract?.address, null)
    const events = await bentoBoxContract?.queryFilter(filter!)
    //const pairAddresses = events?.map(event => event.args?.[2])
    // TODO: remove hardcode from testing
    const pairAddresses = events?.map(event => event.args?.[2])
    //const pairAddresses = ['0x6e9d0853e65f06fab1d5d7d4f78c49bf3595fcb4', '0x6e9d0853e65f06fab1d5d7d4f78c49bf3595fcb4']
    //console.log('pairAddresses:', pairAddresses)

    const pairDetails = await kashiPairHelperContract?.getPairs(CLONE_ADDRESSES[chainId || 1])
    const tokensWithDuplicates: any[] = []
    pairDetails.map((pair: { collateral: string; asset: string }) => {
      tokensWithDuplicates.push(pair.collateral)
      tokensWithDuplicates.push(pair.asset)
    })
    const tokens = Array.from(new Set(tokensWithDuplicates)) // remove duplicates
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
    const tokensWithDetails = await Promise.all(
      tokens.map(async (address: string) => {
        try {
          return await getTokenDetails(address)
        } catch (e) {
          return null
        }
      })
    )
    //console.log('tokensWithDetails:', tokensWithDetails)

    // todo: break if subgraph goes down
    const exchangeEthPrice = await sushiData.exchange.ethPrice()
    const tokensWithPricing = await Promise.all(
      tokens.map(async (address: string) => {
        try {
          const tokenExchangeDetails = await sushiData.exchange.token({
            token_address: getMainnetAddress(address)
          })
          return tokenExchangeDetails?.derivedETH * exchangeEthPrice
        } catch (e) {
          return null
        }
      })
    )

    const balances = await boringHelperContract?.getBalances(account, tokens)

    const balancesWithDetails = tokens.map((tokenAddress, i) => {
      const amount = BigNumber.from(balances[i].bentoShare).isZero()
        ? BigNumber.from(0)
        : BigNumber.from(balances[i].bentoBalance)
            .mul(BigNumber.from(balances[i].bentoAmount))
            .div(BigNumber.from(balances[i].bentoShare))

      // attempt to calculate usdValue, token might not exist on sushiswap mainnet oracle
      // todo: this needs refactor for better precision
      const amountUSD = tokensWithPricing[i]
        ? Number(Fraction.from(amount, BigNumber.from(10).pow(tokensWithDetails[i]?.decimals)).toString()) *
          Number(tokensWithPricing[i]) // todo: object is possibly null
        : 0
      return {
        address: tokenAddress,
        name: tokensWithDetails[i]?.name,
        symbol: tokensWithDetails[i]?.symbol,
        decimals: tokensWithDetails[i]?.decimals,
        amount: {
          // in Balance Interface
          value: amount,
          decimals: tokensWithDetails[i]?.decimals
        },
        amountUSD: amountUSD, // experimental
        priceUSD: tokensWithPricing[i]
        //usdAmountBigInt: usdValue
      }
    })
    //console.log('balancesWithDetails:', balancesWithDetails)
    setBalances(_.orderBy(balancesWithDetails, ['name'], ['asc']))
  }, [account, bentoBoxContract, kashiPairContract?.address, kashiPairHelperContract, library])

  useEffect(() => {
    if (account && bentoBoxContract && library) {
      fetchBentoBalances()
    }
  }, [account, bentoBoxContract, fetchBentoBalances, currentTransactionStatus, library])

  return balances
}

export default useBentoBalances
