import { defaultAbiCoder } from '@ethersproject/abi'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { approveMasterContractAction, approveSLPAction } from 'app/features/trident/context/actions'
import { batchAction, getAsEncodedAction } from 'app/features/trident/context/hooks/actions'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { toShareJSBI } from 'app/functions/bentobox'
import { useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useMemo } from 'react'
import ReactGA from 'react-ga'
import { useRecoilCallback, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import { LiquidityOutput } from '../../types'
import { attemptingTxnAtom, bentoboxRebasesAtom, poolAtom, showReviewAtom, txHashAtom } from '../atoms'
import { usePoolDetailsBurn } from './usePoolDetails'
import useRemovePercentageInput from './useRemovePercentageInput'

export const useClassicStandardRemoveExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const { parsedSLPAmount, outputToWallet } = useRemovePercentageInput()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const { minLiquidityOutput } = usePoolDetailsBurn(parsedSLPAmount)
  const bentoPermit = useRecoilValue(TridentApproveGate.bentoPermit)
  const resetBentoPermit = useResetRecoilState(TridentApproveGate.bentoPermit)
  const slpPermit = useRecoilValue(TridentApproveGate.slpPermit)
  const resetSLPPermit = useResetRecoilState(TridentApproveGate.slpPermit)

  const execute = useRecoilCallback(
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

        const encoded = defaultAbiCoder.encode(['address', 'bool'], [account, outputToWallet])

        try {
          setAttemptingTxn(true)
          const tx = await library.getSigner().sendTransaction({
            from: account,
            to: router.address,
            data: batchAction({
              contract: router,
              actions: [
                approveMasterContractAction({ router, signature: bentoPermit }),
                approveSLPAction({ router, signatureData: slpPermit }),
                getAsEncodedAction({
                  contract: router,
                  fn: 'burnLiquidity',
                  args: [pool.liquidityToken.address, parsedSLPAmount.quotient.toString(), encoded, liquidityOutput],
                }),
              ],
            }),
            value: '0x0',
          })

          setTxHash(tx.hash)
          setShowReview(false)
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
      outputToWallet,
      setAttemptingTxn,
      bentoPermit,
      slpPermit,
      setTxHash,
      setShowReview,
      addTransaction,
      i18n,
      resetBentoPermit,
      resetSLPPermit,
    ]
  )

  return useMemo(() => ({ execute }), [execute])
}
