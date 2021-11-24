import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { toHex } from '@sushiswap/core-sdk'
import { approveMasterContractAction } from 'app/features/trident/context/actions'
import { batchAction } from 'app/features/trident/context/hooks/actions'
import { PoolCreationActionProps, poolCreationActions } from 'app/features/trident/create/context/actions'
import { SpendSource } from 'app/features/trident/create/context/SelectedAsset'
import { useCreatePoolDependencyError } from 'app/features/trident/create/context/useCreatePoolDependencyError'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useConstantProductPoolFactory, useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'
import ReactGA from 'react-ga'
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import { attemptingTxnAtom } from '../../context/atoms'
import {
  createAnOracleSelectionAtom,
  getAllParsedAmountsSelector,
  getAllSelectedAssetsSelector,
  selectedFeeTierAtom,
} from './atoms'

export const useClassicPoolCreateExecute = () => {
  const { i18n } = useLingui()
  const { account, library } = useActiveWeb3React()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()

  const assets = useRecoilValue(getAllSelectedAssetsSelector)
  const parsedAmounts = useRecoilValue(getAllParsedAmountsSelector)
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const feeTier = useRecoilValue(selectedFeeTierAtom)
  const twap = useRecoilValue(createAnOracleSelectionAtom)
  const bentoPermit = useRecoilValue(TridentApproveGate.bentoPermit)
  const resetBentoPermit = useResetRecoilState(TridentApproveGate.bentoPermit)
  const { rebases, loading: rebasesLoading } = useBentoRebases(assets.map((asset) => asset.currency))

  const error = useCreatePoolDependencyError(rebasesLoading, bentoPermit)

  return useCallback(async () => {
    /* Should consider site-wide error messaging & handling strategy */
    if (error || !router || !library || !account) {
      alert(`Dependency error: ${error}`)
      return
    }

    let value = '0x0'
    if (parsedAmounts?.[0]?.currency.isNative && assets[0].spendFromSource === SpendSource.WALLET)
      value = toHex(parsedAmounts[0])
    if (parsedAmounts?.[1]?.currency.isNative && assets[1].spendFromSource === SpendSource.WALLET)
      value = toHex(parsedAmounts[1])

    try {
      setAttemptingTxn(true)
      const tx = await library.getSigner().sendTransaction({
        from: account,
        to: router.address,
        data: batchAction({
          contract: router,
          actions: [
            approveMasterContractAction({ router, signature: bentoPermit }),
            ...poolCreationActions(
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
          ],
        }),
        value,
      })

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

      resetBentoPermit()
      return tx
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
    bentoPermit,
    constantProductPoolFactory,
    error,
    feeTier,
    i18n,
    library,
    parsedAmounts,
    rebases,
    resetBentoPermit,
    router,
    setAttemptingTxn,
    twap,
  ])
}
