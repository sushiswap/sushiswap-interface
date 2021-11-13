import { defaultAbiCoder } from '@ethersproject/abi'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { toShareJSBI } from 'app/functions/bentobox'
import { useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useMemo } from 'react'
import ReactGA from 'react-ga'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'

import { LiquidityOutput } from '../../types'
import {
  attemptingTxnAtom,
  bentoboxRebasesAtom,
  outputToWalletAtom,
  poolAtom,
  showReviewAtom,
  txHashAtom,
} from '../atoms'
import usePercentageInput from './usePercentageInput'
import { usePoolDetailsBurn } from './usePoolDetails'

export const useClassicStandardRemoveExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const { parsedSLPAmount } = usePercentageInput()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const { minLiquidityOutput } = usePoolDetailsBurn(parsedSLPAmount)

  const execute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const { pool } = await snapshot.getPromise(poolAtom)
        const [minOutputA, minOutputB] = minLiquidityOutput
        const outputToWallet = await snapshot.getPromise(outputToWalletAtom)

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

          const tx = await router.burnLiquidity(
            pool.liquidityToken.address,
            parsedSLPAmount.quotient.toString(),
            encoded,
            liquidityOutput
          )

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
      setAttemptingTxn,
      setTxHash,
      setShowReview,
      addTransaction,
      i18n,
    ]
  )

  return useMemo(() => ({ execute }), [execute])
}
