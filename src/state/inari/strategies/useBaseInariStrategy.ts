import { useActiveWeb3React, useApproveCallback, useInariContract } from '../../../hooks'
import { useTransactionAdder } from '../../transactions/hooks'
import { BaseStrategyHook, StrategyBalances } from '../types'
import { useDerivedInariState } from '../hooks'
import { useCallback, useMemo, useState } from 'react'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { e10 } from '../../../functions'
import useSushiPerXSushi from '../../../hooks/useXSushiPerSushi'

const useBaseInariStrategy = ({ id, general, tokenDefinitions }): BaseStrategyHook => {
  const { account } = useActiveWeb3React()
  const { inputValue, zapIn, tokens } = useDerivedInariState()
  const inariContract = useInariContract()
  const addTransaction = useTransactionAdder()
  const approveCallback = useApproveCallback(inputValue, inariContract?.address)
  const sushiPerXSushi = useSushiPerXSushi(true)
  const [balances, _setBalances] = useState<StrategyBalances>({
    inputTokenBalance: CurrencyAmount.fromRawAmount(tokens.inputToken, '0'),
    outputTokenBalance: CurrencyAmount.fromRawAmount(tokens.outputToken, '0'),
  })

  // Basic execution function, can be overridden in child strategies
  // Can provide custom value to do some pre-transformation
  const execute = useCallback(
    async (val: CurrencyAmount<Token>) => {
      if (!inariContract) return

      try {
        const method = zapIn ? general.zapMethod : general.unzapMethod
        const tx = await inariContract[method](account, val.toExact().toBigNumber(val.currency.decimals))
        return addTransaction(tx, {
          summary: `${zapIn ? 'Deposit' : 'Withdraw'} ${general.outputSymbol}`,
        })
      } catch (error) {
        console.error(error)
      }
    },
    [account, addTransaction, general.outputSymbol, general.unzapMethod, general.zapMethod, inariContract, zapIn]
  )

  // Get basic strategy information, dont override this function
  const getStrategy = useCallback(() => {
    return {
      id,
      general,
      tokenDefinitions,
    }
  }, [general, id, tokenDefinitions])

  // Responsible for calculating the output based on the input
  // This one is default and is going from sushi to xsushi and vice-versa.
  // Function can be overridden if you need custom input to output calculations
  const calculateOutputFromInput = useCallback(
    (zapIn: boolean, inputValue: string, inputToken: Token, outputToken: Token) => {
      if (!sushiPerXSushi || !inputValue) return null

      return (
        zapIn
          ? inputValue.toBigNumber(18).mulDiv(e10(18), sushiPerXSushi.toString().toBigNumber(18))
          : inputValue.toBigNumber(18).mulDiv(sushiPerXSushi.toString().toBigNumber(18), e10(18))
      )?.toFixed(18)
    },
    [sushiPerXSushi]
  )

  // Allows for setting balance
  // convenient when balances are loaded async in child strategies
  const setBalances = useCallback(
    ({
      inputTokenBalance,
      outputTokenBalance,
    }: {
      inputTokenBalance?: CurrencyAmount<Token>
      outputTokenBalance?: CurrencyAmount<Token>
    }) => {
      _setBalances((prevState) => ({
        ...prevState,
        inputTokenBalance,
        outputTokenBalance,
      }))
    },
    []
  )

  return useMemo(
    () => ({
      id,
      general,
      tokenDefinitions,
      execute,
      approveCallback,
      getStrategy,
      calculateOutputFromInput,
      balances: {
        inputTokenBalance: zapIn ? balances.inputTokenBalance : balances.outputTokenBalance,
        outputTokenBalance: zapIn ? balances.outputTokenBalance : balances.inputTokenBalance,
      },
      setBalances,
    }),
    [
      approveCallback,
      balances.inputTokenBalance,
      balances.outputTokenBalance,
      calculateOutputFromInput,
      execute,
      general,
      getStrategy,
      id,
      setBalances,
      tokenDefinitions,
      zapIn,
    ]
  )
}

export default useBaseInariStrategy
