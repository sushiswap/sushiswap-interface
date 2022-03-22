import { BigNumber } from '@ethersproject/bignumber'
import { JSBI } from '@sushiswap/core-sdk'
import { batchAction } from 'app/features/trident/actions'
import { useBentoBoxContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

import { depositAction, harvestAction, withdrawAction } from './actions'

const useBentoBox = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const bentobox = useBentoBoxContract(true)

  const deposit = useCallback(
    async (tokenAddress: string, amount: BigNumber) => {
      if (!amount || !chainId || !account || !bentobox || !library) return

      try {
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: bentobox.address,
          ...depositAction({ bentobox, tokenAddress, account, amount, chainId }),
        })

        if (tx?.hash) return addTransaction(tx, { summary: 'Deposit to Bentobox' })
      } catch (e) {
        console.error('Bentobox deposit error:', e)
        return e
      }
    },
    [account, addTransaction, bentobox, chainId, library]
  )

  const withdraw = useCallback(
    async (tokenAddress: string, amount: BigNumber, share?: JSBI) => {
      if (!amount || !chainId || !account || !bentobox || !library) return

      try {
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: bentobox.address,
          ...withdrawAction({ bentobox, tokenAddress, account, amount, chainId, share }),
        })

        if (tx?.hash) return addTransaction(tx, { summary: 'Withdraw from Bentobox' })
      } catch (e) {
        console.error('Bentobox withdraw error:', e)
        return e
      }
    },
    [account, addTransaction, bentobox, chainId, library]
  )

  const harvest = useCallback(
    async (tokenAddress: string, rebalance: boolean = false) => {
      if (chainId || !bentobox || !library || !account) return

      try {
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: bentobox.address,
          ...harvestAction({ bentobox, tokenAddress, rebalance }),
        })

        if (tx?.hash) return addTransaction(tx, { summary: rebalance ? 'Harvest & Rebalance' : 'Harvest' })
      } catch (e) {
        console.error('bentobox harvest error:', e)
        return e
      }
    },
    [account, addTransaction, bentobox, chainId, library]
  )

  // TODO Ramin
  const withdrawWithHarvest = useCallback(
    async (tokenAddress: string, share: JSBI) => {
      if (!chainId || !account || !bentobox || !library) return

      try {
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: bentobox.address,
          data: batchAction({
            contract: bentobox,
            actions: [
              // Max withdraw
              withdrawAction({ bentobox, tokenAddress, account, amount: BigNumber.from(0), chainId, share }).data,
              // Rebalance
              harvestAction({ bentobox, tokenAddress, rebalance: true }).data,
              // Withdraw remaining
              withdrawAction({ bentobox, tokenAddress, account, amount: BigNumber.from(0), chainId, share }).data,
            ],
          }),
        })

        if (tx?.hash) return addTransaction(tx, { summary: 'Withdraw from Bentobox' })
      } catch (e) {
        console.error('Bentobox withdraw error:', e)
        return e
      }
    },
    [account, addTransaction, bentobox, chainId, library]
  )

  return { deposit, withdraw, harvest, withdrawWithHarvest }
}

export default useBentoBox
