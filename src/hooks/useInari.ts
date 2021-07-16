import { useInariContract, useZenkoContract } from './useContract'
import { CurrencyAmount } from '@sushiswap/sdk'
import { ethers } from 'ethers'
import { useDerivedInariState, useInariState } from '../state/inari/hooks'
import { useERC20Permit } from './useERC20Permit'
import { useActiveWeb3React, useApproveCallback } from './index'
import { toHex } from '../functions/approveAmountCalldata'
import { useTransactionAdder } from '../state/transactions/hooks'

const useInari = () => {
  const { account } = useActiveWeb3React()
  const { zapIn } = useInariState()
  const addTransaction = useTransactionAdder()
  const { strategy, zapInValue } = useDerivedInariState()
  const inariContract = useInariContract()

  const erc20Permit = useERC20Permit(
    CurrencyAmount.fromRawAmount(strategy.inputToken, ethers.constants.MaxUint256.toString()),
    inariContract?.address,
    null
  )

  // IF USING APPROVE CALLBACK -------------------------------------------------
  const approveCallback = useApproveCallback(
    CurrencyAmount.fromRawAmount(strategy.inputToken, ethers.constants.MaxUint256.toString()),
    inariContract?.address
  )
  // ---------------------------------------------------------------------------

  const inari = async () => {
    if (!inariContract) return

    // IF USING ERC20 PERMIT ---------------------------------------------------
    // if (erc20Permit.state !== UseERC20PermitState.SIGNED)
    //   throw Error('This shouldn`t be possible, execution flow error')
    // -------------------------------------------------------------------------

    try {
      const method = zapIn ? strategy.zapMethod : strategy.unzapMethod
      const tx = await inariContract[method](account, toHex(zapInValue.quotient))

      return addTransaction(tx, {
        summary: `${zapIn ? 'Deposit' : 'Withdraw'} ${strategy.outputSymbol}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return { erc20Permit, approveCallback, inari }
}

export default useInari
