import { useActiveWeb3React } from './index'
import { useMemo } from 'react'
import { useTokenBalances } from '../state/wallet/hooks'
import { useBentoBalances2 } from '../state/bentobox/hooks'
import { Currency } from '@sushiswap/sdk'

const useBentoOrWalletBalance = (currencies: Currency[], bentoBox: boolean) => {
  const { account } = useActiveWeb3React()

  const tokens = useMemo(() => currencies.map((el) => el?.wrapped), [currencies])
  const walletBalances = useTokenBalances(account, tokens)
  const bentoBalances = useBentoBalances2(account, tokens)

  return useMemo(() => (bentoBox ? bentoBalances : walletBalances), [bentoBalances, bentoBox, walletBalances])
}

export default useBentoOrWalletBalance
