import { useInariContract } from './useContract'
import { useDerivedInariState, useInariState } from '../state/inari/hooks'
import { useActiveWeb3React, useApproveCallback } from './index'
import { useTransactionAdder } from '../state/transactions/hooks'

const useInari = () => {
  const { account } = useActiveWeb3React()
  const { zapIn } = useInariState()
  const addTransaction = useTransactionAdder()
  const { strategy, zapInValue, allowanceValue } = useDerivedInariState()
  const inariContract = useInariContract()
  const approveCallback = useApproveCallback(allowanceValue, inariContract?.address)

  const inari = async () => {
    if (!inariContract) return

    try {
      const method = zapIn ? strategy.zapMethod : strategy.unzapMethod

      // If the token is not 1:1 with XSUSHI you can use the transformZapInValue
      // key to transform the XSUSHI amount to this other amount
      const val = zapIn
        ? zapInValue
        : strategy.transformZapInValue
        ? await strategy.transformZapInValue(zapInValue)
        : zapInValue

      const tx = await inariContract[method](account, val.toExact().toBigNumber(allowanceValue.currency.decimals))
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
