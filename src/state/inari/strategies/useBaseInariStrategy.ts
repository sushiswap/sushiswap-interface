import { useActiveWeb3React, useApproveCallback, useInariContract } from '../../../hooks'
import { useTransactionAdder } from '../../transactions/hooks'
import { BaseStrategyHook, StrategyBalances, StrategyGeneralInfo, StrategyTokenDefinitions } from '../types'
import { useDerivedInariState } from '../hooks'
import { useCallback, useMemo, useState } from 'react'
import { CurrencyAmount, Token } from '@sushiswap/sdk'
import { e10 } from '../../../functions'
import useSushiPerXSushi from '../../../hooks/useXSushiPerSushi'
import useBentoMasterApproveCallback, { BentoPermit } from '../../../hooks/useBentoMasterApproveCallback'

interface useBaseInariStrategyInterface {
  id: string
  general: StrategyGeneralInfo
  tokenDefinitions: StrategyTokenDefinitions
  usesBentoBox?: boolean
}

const useBaseInariStrategy = ({
  id,
  general,
  tokenDefinitions,
  usesBentoBox = false,
}: useBaseInariStrategyInterface): BaseStrategyHook => {
  const { account } = useActiveWeb3React()
  const { inputValue, zapIn, tokens } = useDerivedInariState()
  const inariContract = useInariContract()
  const addTransaction = useTransactionAdder()
  const approveCallback = useApproveCallback(inputValue, inariContract?.address)
  const sushiPerXSushi = useSushiPerXSushi(true)
  const bentoApproveCallback = useBentoMasterApproveCallback(inariContract.address, {
    otherBentoBoxContract: inariContract,
    contractName: 'Inari',
    functionFragment: 'setBentoApproval',
  })
  const [balances, _setBalances] = useState<StrategyBalances>({
    inputTokenBalance: CurrencyAmount.fromRawAmount(tokens.inputToken, '0'),
    outputTokenBalance: CurrencyAmount.fromRawAmount(tokens.outputToken, '0'),
  })

  // Get basic strategy information, DONT override this function unless you know what you're doing
  // Responsible for switching strategies
  const getStrategy = useCallback(() => {
    return {
      id,
      general,
      tokenDefinitions,
      usesBentoBox,
    }
  }, [general, id, tokenDefinitions, usesBentoBox])

  // Default execution function, can be overridden in child strategies
  // If you override, it's best to do some formatting beforehand and then still call this function
  // Look at useStakeSushiToCreamStrategy for an example
  const execute = useCallback(
    async (val: CurrencyAmount<Token>, bentoPermit?: BentoPermit) => {
      if (!inariContract) return

      const method = zapIn ? general.zapMethod : general.unzapMethod

      try {
        // If we have a permit, batch tx with permit
        if (bentoPermit) {
          const batch = [
            bentoPermit.data,
            inariContract?.interface?.encodeFunctionData(method, [
              account,
              val.toExact().toBigNumber(val.currency.decimals),
            ]),
          ]

          const tx = await inariContract.batch(batch, true)
          addTransaction(tx, {
            summary: `Approve Inari Master Contract and ${zapIn ? 'Deposit' : 'Withdraw'} ${general.outputSymbol}`,
          })

          return tx
        }

        // Else proceed normally
        else {
          const tx = await inariContract[method](account, val.toExact().toBigNumber(val.currency.decimals))
          addTransaction(tx, {
            summary: `${zapIn ? 'Deposit' : 'Withdraw'} ${general.outputSymbol}`,
          })

          return tx
        }
      } catch (error) {
        console.error(error)
      }
    },
    [account, addTransaction, general.outputSymbol, general.unzapMethod, general.zapMethod, inariContract, zapIn]
  )

  // Default function for calculating the output based on the input
  // This one is converting Sushi to xSushi and vice-versa.
  // Function can be overridden or enhanced if you need custom input to output calculations
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

  // Convenience wrapper function that allows for setting balances
  // Mostly used when balances are loaded async in child strategies
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
      ...(usesBentoBox && { bentoApproveCallback }),
    }),
    [
      approveCallback,
      balances.inputTokenBalance,
      balances.outputTokenBalance,
      bentoApproveCallback,
      calculateOutputFromInput,
      execute,
      general,
      getStrategy,
      id,
      setBalances,
      tokenDefinitions,
      usesBentoBox,
      zapIn,
    ]
  )
}

export default useBaseInariStrategy
