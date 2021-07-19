import { useInariContract } from './useContract'
import { useDerivedInariState, useInariState } from '../state/inari/hooks'
import { useActiveWeb3React, useApproveCallback } from './index'
import { toHex } from '../functions/approveAmountCalldata'
import { useTransactionAdder } from '../state/transactions/hooks'

const useInari = () => {
  const { account } = useActiveWeb3React()
  const { zapIn } = useInariState()
  const addTransaction = useTransactionAdder()
  const { strategy, zapInValue } = useDerivedInariState()
  const inariContract = useInariContract()
  const approveCallback = useApproveCallback(zapInValue, inariContract?.address)

  const inari = async () => {
    if (!inariContract) return

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

  return { approveCallback, inari }
}

export default useInari
