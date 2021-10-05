import { attemptingTxnAtom, showReviewAtom, spendFromWalletAtom, txHashAtom } from '../atoms'
import {
  useActiveWeb3React,
  useBentoBoxContract,
  useConstantProductPoolFactory,
  useMasterDeployerContract,
  useTridentRouterContract,
} from '../../../../hooks'
import { useCallback, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import ReactGA from 'react-ga'
import { computeConstantProductPoolAddress } from '@sushiswap/trident-sdk'
import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import { useIndependentAssetInputs } from './useIndependentAssetInputs'
import { useLingui } from '@lingui/react'
import { useSetupPoolProperties } from './useSetupPoolProperties'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'

export const useClassicPoolCreateExecute = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const masterDeployer = useMasterDeployerContract()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const bentoboxContract = useBentoBoxContract()
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const router = useTridentRouterContract()

  const {
    feeTier: [feeTier],
    twap: [twap],
  } = useSetupPoolProperties()
  const {
    currencies: [selectedPoolCurrencies],
    parsedAmounts,
  } = useIndependentAssetInputs()

  const execute = useCallback(async () => {
    if (
      !account ||
      !bentoboxContract ||
      !masterDeployer ||
      !constantProductPoolFactory ||
      !selectedPoolCurrencies[0] ||
      !selectedPoolCurrencies[1] ||
      !parsedAmounts[0] ||
      !parsedAmounts[1] ||
      !feeTier ||
      !parsedAmounts.every((el) => el?.greaterThan(0))
    )
      throw new Error('missing dependencies')

    // Pool creation data
    const [a, b] = selectedPoolCurrencies.map((el: Currency) => el.wrapped)
    const [tokenA, tokenB] = a.sortsBefore(b) ? [a, b] : [b, a]
    const deployData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'address', 'uint8', 'bool'],
      [...[tokenA.address, tokenB.address].sort(), feeTier, twap]
    )

    // Adding liquidity data
    const indexOfNative = parsedAmounts.findIndex((el: CurrencyAmount<Currency>) => el.currency.isNative)
    const value = indexOfNative > 0 ? { value: parsedAmounts[indexOfNative]?.quotient.toString() } : {}
    const liquidityInput = await Promise.all(
      parsedAmounts.map(async (el: CurrencyAmount<Currency>) => ({
        token: el.currency.wrapped.address,
        native: spendFromWallet,
        amount: await bentoboxContract.toShare(el.currency.wrapped.address, el.quotient.toString(), false),
      }))
    )

    const batch = [
      router?.interface?.encodeFunctionData('deployPool', [constantProductPoolFactory.address, deployData]),
      router?.interface?.encodeFunctionData('addLiquidity', [
        liquidityInput,
        computeConstantProductPoolAddress({
          factoryAddress: constantProductPoolFactory.address,
          tokenA,
          tokenB,
          fee: feeTier,
          twap,
        }),
        1,
        ethers.utils.defaultAbiCoder.encode(['address'], [account]),
      ]),
    ]

    try {
      setAttemptingTxn(true)
      const tx = await router?.batch(batch, value)

      setTxHash(tx.hash)
      setShowReview(false)
      await tx.wait()

      addTransaction(tx, {
        summary: i18n._(
          t`Create pool and add liquidity for tokens ${selectedPoolCurrencies[0].symbol} and ${selectedPoolCurrencies[1].symbol}`
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
    account,
    addTransaction,
    bentoboxContract,
    constantProductPoolFactory,
    feeTier,
    i18n,
    masterDeployer,
    parsedAmounts,
    router,
    selectedPoolCurrencies,
    setAttemptingTxn,
    setShowReview,
    setTxHash,
    spendFromWallet,
    twap,
  ])

  return useMemo(() => ({ execute }), [execute])
}
