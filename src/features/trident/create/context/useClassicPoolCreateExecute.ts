import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  PoolCreationActionProps,
  poolCreationActions,
  valueIfNative,
} from 'app/features/trident/create/context/actions'
import { useCreatePoolDependencyError } from 'app/features/trident/create/context/useCreatePoolDependencyError'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useConstantProductPoolFactory, useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'
import ReactGA from 'react-ga'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { attemptingTxnAtom, showReviewAtom, txHashAtom } from '../../context/atoms'
import {
  createAnOracleSelectionAtom,
  getAllParsedAmountsSelector,
  getAllSelectedAssetsSelector,
  selectedFeeTierAtom,
} from './atoms'

export const useClassicPoolCreateExecute = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()

  const assets = useRecoilValue(getAllSelectedAssetsSelector)
  const parsedAmounts = useRecoilValue(getAllParsedAmountsSelector)
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const feeTier = useRecoilValue(selectedFeeTierAtom)
  const twap = useRecoilValue(createAnOracleSelectionAtom)

  const { rebases, loading: rebasesLoading } = useBentoRebases(assets.map((asset) => asset.currency))

  const error = useCreatePoolDependencyError(rebasesLoading)

  return useCallback(async () => {
    /* Should consider site-wide error messaging & handling strategy */
    if (error) {
      alert(`Dependency error: ${error}`)
      return
    }

    try {
      setAttemptingTxn(true)
      const tx = await router?.batch(
        poolCreationActions(
          {
            account,
            assets,
            constantProductPoolFactory,
            router,
            feeTier,
            twap,
            parsedAmounts,
            rebases,
          } as PoolCreationActionProps /* Can cast given the error guard above */
        ),
        valueIfNative(parsedAmounts)
      )

      setTxHash(tx.hash)
      setShowReview(false)
      await tx.wait()

      addTransaction(tx, {
        summary: i18n._(
          t`Create pool and add liquidity for tokens ${assets[0].currency!!.symbol} and ${assets[1].currency!!.symbol}`
        ),
      })

      setAttemptingTxn(false)

      ReactGA.event({
        category: 'Constant Product Pool',
        action: 'Create',
        label: [assets[0].currency!!.symbol, assets[1].currency!!.symbol].join('/'),
      })
    } catch (error) {
      setAttemptingTxn(false)
      if (error instanceof String) {
        alert(`Error with pool creation: ${error}`)
      }
      // we only care if the error is something _other_ than the user rejected the tx
      if ((error as { code: number }).code !== 4001) {
        alert(`Error with pool creation: ${JSON.stringify(error)}`)
      }
      console.error(error)
    }
  }, [
    account,
    addTransaction,
    assets,
    constantProductPoolFactory,
    error,
    feeTier,
    i18n,
    parsedAmounts,
    rebases,
    router,
    setAttemptingTxn,
    setShowReview,
    setTxHash,
    twap,
  ])
}
