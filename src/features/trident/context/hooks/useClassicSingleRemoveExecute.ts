import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { usePoolDetailsBurn } from 'app/features/trident/context/hooks/usePoolDetails'
import useRemovePercentageInput from 'app/features/trident/context/hooks/useRemovePercentageInput'
import { toShareJSBI } from 'app/functions'
import { useTridentRouterContract } from 'app/hooks'
import { useBentoRebase } from 'app/hooks/useBentoRebases'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import ReactGA from 'react-ga'
import { useRecoilCallback, useSetRecoilState } from 'recoil'

import { attemptingTxnAtom, poolAtom, showReviewAtom, txHashAtom } from '../atoms'

export const useClassicSingleRemoveExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const {
    parsedSLPAmount,
    zapCurrency: [zapCurrency],
    outputToWallet,
  } = useRemovePercentageInput()
  const { minLiquidityOutputSingleToken } = usePoolDetailsBurn(parsedSLPAmount)
  const { rebase } = useBentoRebase(zapCurrency?.wrapped)
  const minOutputAmount = useMemo(
    () => minLiquidityOutputSingleToken(zapCurrency?.wrapped),
    [minLiquidityOutputSingleToken, zapCurrency?.wrapped]
  )

  const execute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const { pool } = await snapshot.getPromise(poolAtom)

        if (!pool || !chainId || !library || !account || !router || !minOutputAmount || !rebase || !parsedSLPAmount)
          throw new Error('missing dependencies')

        const encoded = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'bool'],
          [minOutputAmount?.currency.wrapped.address, account, outputToWallet]
        )

        try {
          setAttemptingTxn(true)
          const tx = await router.burnLiquiditySingle(
            pool.liquidityToken.address,
            parsedSLPAmount.quotient.toString(),
            encoded,
            toShareJSBI(rebase, minOutputAmount.quotient).toString()
          )

          setTxHash(tx.hash)
          setShowReview(false)
          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(t`Remove ${parsedSLPAmount?.toSignificant(3)} ${parsedSLPAmount?.currency.symbol}`),
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
      account,
      addTransaction,
      chainId,
      i18n,
      library,
      minOutputAmount,
      outputToWallet,
      parsedSLPAmount,
      rebase,
      router,
      setAttemptingTxn,
      setShowReview,
      setTxHash,
    ]
  )

  return useMemo(() => ({ execute }), [execute])
}
