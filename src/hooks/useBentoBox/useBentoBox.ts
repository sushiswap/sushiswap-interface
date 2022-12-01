import { BigNumber } from '@ethersproject/bignumber'
import { Currency, JSBI, Rebase } from '@figswap/core-sdk'
import { toShare } from '@sushiswap/bentobox-sdk'
import { ERC20_ABI } from 'app/constants/abis/erc20'
import { getContract } from 'app/functions'
import { useBentoBoxContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { Signature } from 'ethers'
import { useCallback } from 'react'

import {
  batchAction,
  bentoTransferAssetAction,
  depositAction,
  harvestAction,
  masterContractApproveAction,
  withdrawAction,
} from './actions'

const useBentoBox = (masterContract?: string) => {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const bentobox = useBentoBoxContract(true)

  const withdrawWithHarvest = useCallback(
    async (tokenAddress: string, availableAmount: BigNumber, amount: BigNumber) => {
      if (!chainId || !account || !bentobox || !library) return

      try {
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: bentobox.address,
          data: batchAction({
            bentobox,
            actions: [
              // Withdraw available amount
              withdrawAction({ bentobox, tokenAddress, account, amount: availableAmount, chainId }).data,
              // Rebalance
              harvestAction({ bentobox, tokenAddress, rebalance: true }).data,
              // Withdraw remaining
              withdrawAction({ bentobox, tokenAddress, account, amount: amount.sub(availableAmount), chainId }).data,
            ],
            revertOnFail: false,
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

  const deposit = useCallback(
    async (token: Currency, rebase: Rebase, amount: BigNumber, permit?: Signature) => {
      if (!amount || !chainId || !account || !bentobox || !library) return
      const batch: string[] = []
      let summary = ''

      try {
        const deadBalance = await bentobox.balanceOf(
          token.wrapped.address,
          '0x000000000000000000000000000000000000dead'
        )

        const share = (
          JSBI.equal(JSBI.BigInt(0), rebase.base) && JSBI.equal(JSBI.BigInt(0), rebase.elastic)
            ? amount
            : BigNumber.from(toShare(rebase, JSBI.BigInt(amount)).toString())
        ).sub(deadBalance.isZero() ? 1000 : 0)

        // Approve
        if (permit && masterContract) {
          batch.push(masterContractApproveAction({ bentobox, masterContract, permit, account }).data)
          summary += 'Approve Master Contract and'
        }

        const { data: depositData, value: depositValue } = depositAction({
          bentobox,
          tokenAddress: token.wrapped.address,
          account,
          amount,
          share,
          chainId,
        })

        batch.push(depositData)
        summary += 'Deposit to Bentobox'

        if (deadBalance.isZero()) {
          batch.push(
            bentoTransferAssetAction({
              bentobox,
              fromAddress: account,
              tokenAddress: token.wrapped.address,
              toAddress: '0x000000000000000000000000000000000000dead',
              share: BigNumber.from(1),
            }).data
          )
        }

        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: bentobox.address,
          data: batchAction({
            bentobox,
            actions: batch,
            revertOnFail: true,
          }),
          value: depositValue,
        })

        if (tx?.hash) {
          addTransaction(tx, { summary })
          await tx.wait()
        }

        return tx
      } catch (e) {
        console.error('Bentobox deposit error:', e)
        return e
      }
    },
    [account, addTransaction, bentobox, chainId, library, masterContract]
  )

  const withdraw = useCallback(
    async (tokenAddress: string, amount: BigNumber, share?: JSBI) => {
      if (!amount || !chainId || !account || !bentobox || !library) return

      const erc20Contract = getContract(tokenAddress, ERC20_ABI, library)
      const availableAmount = await erc20Contract.balanceOf(bentobox?.address)
      if (amount.gt(availableAmount)) {
        // Not enough available in Bentobox, withdraw with harvest
        return withdrawWithHarvest(tokenAddress, availableAmount, amount)
      }

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
    [account, addTransaction, bentobox, chainId, library, withdrawWithHarvest]
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

  return { deposit, withdraw, harvest, withdrawWithHarvest }
}

export default useBentoBox
