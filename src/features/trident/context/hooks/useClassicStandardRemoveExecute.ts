import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { WNATIVE } from '@sushiswap/core-sdk'
import { approveMasterContractAction, approveSLPAction } from 'app/features/trident/context/actions'
import {
  batchAction,
  burnLiquidityAction,
  sweepNativeTokenAction,
  unwrapWETHAction,
} from 'app/features/trident/context/hooks/actions'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { toShareJSBI } from 'app/functions/bentobox'
import { useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import ReactGA from 'react-ga'
import { useRecoilCallback, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import { LiquidityOutput } from '../../types'
import { attemptingTxnAtom, bentoboxRebasesAtom, poolAtom } from '../atoms'
import { usePoolDetailsBurn } from './usePoolDetails'
import useRemovePercentageInput from './useRemovePercentageInput'

export const useClassicStandardRemoveExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const { parsedSLPAmount, outputToWallet, receiveNative } = useRemovePercentageInput()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const { minLiquidityOutput } = usePoolDetailsBurn(parsedSLPAmount)
  const bentoPermit = useRecoilValue(TridentApproveGate.bentoPermit)
  const resetBentoPermit = useResetRecoilState(TridentApproveGate.bentoPermit)
  const slpPermit = useRecoilValue(TridentApproveGate.slpPermit)
  const resetSLPPermit = useResetRecoilState(TridentApproveGate.slpPermit)

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const { pool } = await snapshot.getPromise(poolAtom)
        const [minOutputA, minOutputB] = minLiquidityOutput

        if (
          !pool ||
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedSLPAmount ||
          !minOutputA ||
          !minOutputB ||
          !rebases[minOutputA.currency.wrapped.address] ||
          !rebases[minOutputB.currency.wrapped.address]
        )
          throw new Error('missing dependencies')

        const liquidityOutput: LiquidityOutput[] = [
          {
            token: minOutputA.wrapped.currency.address,
            amount: toShareJSBI(rebases[minOutputA.wrapped.currency.address], minOutputA.quotient).toString(),
          },
          {
            token: minOutputB.wrapped.currency.address,
            amount: toShareJSBI(rebases[minOutputB.wrapped.currency.address], minOutputB.quotient).toString(),
          },
        ]

        const indexOfWETH = minOutputA.wrapped.currency.address === WNATIVE[chainId].address ? 0 : 1
        const receiveETH = receiveNative[0] && outputToWallet
        const actions = [
          approveMasterContractAction({ router, signature: bentoPermit }),
          approveSLPAction({ router, signatureData: slpPermit }),
          burnLiquidityAction({
            router,
            address: pool.liquidityToken.address,
            amount: parsedSLPAmount.quotient.toString(),
            recipient: receiveETH ? router.address : account,
            liquidityOutput,
            receiveToWallet: outputToWallet,
          }),
        ]

        if (receiveETH) {
          actions.push(
            unwrapWETHAction({
              router,
              amountMinimum: liquidityOutput[indexOfWETH].amount,
              recipient: account,
            }),
            sweepNativeTokenAction({
              router,
              token: liquidityOutput[indexOfWETH === 0 ? 1 : 0].token,
              recipient: account,
              amount: liquidityOutput[indexOfWETH === 0 ? 1 : 0].amount,
            })
          )
        }

        try {
          setAttemptingTxn(true)
          const tx = await library.getSigner().sendTransaction({
            from: account,
            to: router.address,
            data: batchAction({
              contract: router,
              actions,
            }),
            value: '0x0',
          })

          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(t`Remove ${parsedSLPAmount?.toSignificant(3)} ${parsedSLPAmount?.wrapped.currency.symbol}`),
          })

          setAttemptingTxn(false)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Burn',
            label: [pool.token0.symbol, pool.token1.symbol].join('/'),
          })

          resetBentoPermit()
          resetSLPPermit()
          return tx
        } catch (error) {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        }
      },
    [
      minLiquidityOutput,
      chainId,
      library,
      account,
      router,
      parsedSLPAmount,
      rebases,
      receiveNative,
      outputToWallet,
      bentoPermit,
      slpPermit,
      setAttemptingTxn,
      addTransaction,
      i18n,
      resetBentoPermit,
      resetSLPPermit,
    ]
  )
}
