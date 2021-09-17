import { useLingui } from '@lingui/react'
import { useConstantProductPoolFactory, useMasterDeployerContract } from '../../../../hooks'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import { attemptingTxnAtom, showReviewAtom, txHashAtom } from '../atoms'
import { useSetupPoolProperties } from './useSetupPoolProperties'
import { ethers } from 'ethers'
import { calculateGasMargin } from '../../../../functions'
import { t } from '@lingui/macro'
import ReactGA from 'react-ga'
import { useCallback, useMemo } from 'react'
import { useIndependentAssetInputs } from './useIndependentAssetInputs'

export const usePoolCreateExecute = () => {
  const { i18n } = useLingui()
  const masterDeployer = useMasterDeployerContract()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const {
    feeTier: [feeTier],
    twap: [twap],
  } = useSetupPoolProperties()
  const {
    currencies: [selectedPoolCurrencies],
  } = useIndependentAssetInputs()

  // TODO Doesn't add liquidity yet, merely creates the pool
  const classicExecute = useCallback(async () => {
    if (
      !masterDeployer ||
      !constantProductPoolFactory ||
      !selectedPoolCurrencies[0] ||
      !selectedPoolCurrencies[1] ||
      !feeTier
    )
      throw new Error('missing dependencies')

    const [a, b] = selectedPoolCurrencies.map((el) => el.wrapped)
    const [token0, token1] = a.sortsBefore(b) ? [a, b] : [b, a]

    const estimate = masterDeployer.estimateGas.deployPool
    const method = masterDeployer.deployPool
    const deployData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'address', 'uint8', 'bool'],
      [...[token0.address, token1.address].sort(), feeTier, twap]
    )

    try {
      setAttemptingTxn(true)
      const estimatedGasLimit = await estimate(constantProductPoolFactory.address, deployData, {})
      const tx = await method(constantProductPoolFactory.address, deployData, {
        gasLimit: calculateGasMargin(estimatedGasLimit),
      })

      setTxHash(tx.hash)
      setShowReview(false)
      await tx.wait()

      addTransaction(tx, {
        summary: i18n._(
          t`Create pool for tokens ${selectedPoolCurrencies[0].symbol} and ${selectedPoolCurrencies[1].symbol}`
        ),
      })

      setAttemptingTxn(false)

      ReactGA.event({
        category: 'Constant Product Pool',
        action: 'Create',
        label: [selectedPoolCurrencies[0].symbol, selectedPoolCurrencies[1].symbol].join('/'),
      })
    } catch (error) {
      setAttemptingTxn(false)
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error)
      }
    }
  }, [
    addTransaction,
    constantProductPoolFactory,
    feeTier,
    i18n,
    masterDeployer,
    selectedPoolCurrencies,
    setAttemptingTxn,
    setShowReview,
    setTxHash,
    twap,
  ])

  const hybridExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {},
    []
  )

  const weightedExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {},
    []
  )

  const concentratedExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {},
    []
  )

  return useMemo(
    () => ({
      classicExecute,
      hybridExecute,
      weightedExecute,
      concentratedExecute,
    }),
    [classicExecute, concentratedExecute, hybridExecute, weightedExecute]
  )
}
