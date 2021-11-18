import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { computeConstantProductPoolAddress } from '@sushiswap/trident-sdk'
import { toShareJSBI } from 'app/functions'
import useBentoRebases from 'app/hooks/useBentoRebases'
import {
  useConstantProductPoolFactory,
  useMasterDeployerContract,
  useTridentRouterContract,
} from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback, useMemo } from 'react'
import ReactGA from 'react-ga'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { selectedFeeTierAtom, twapAtom } from '../../create/context/atoms'
import { attemptingTxnAtom, showReviewAtom, spendFromWalletAtom, txHashAtom } from '../atoms'
// @ts-ignore
import { useIndependentAssetInputs } from './useIndependentAssetInputs'

// TODO: NEXT PR TO ADJUST TO NEW STORES

export const useClassicPoolCreateExecute = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const masterDeployer = useMasterDeployerContract()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const spendFromWallet = useRecoilValue(spendFromWalletAtom)
  const router = useTridentRouterContract()
  const feeTier = useRecoilValue(selectedFeeTierAtom)
  const twap = useRecoilValue(twapAtom)
  const {
    currencies: [selectedPoolCurrencies],
    parsedAmounts,
  } = useIndependentAssetInputs()

  const { rebases, loading: rebasesLoading } = useBentoRebases(selectedPoolCurrencies)

  const execute = useCallback(async () => {
    if (
      !account ||
      !masterDeployer ||
      !constantProductPoolFactory ||
      !selectedPoolCurrencies[0] ||
      !selectedPoolCurrencies[1] ||
      !parsedAmounts[0] ||
      !parsedAmounts[1] ||
      !feeTier ||
      !parsedAmounts.every((el) => el?.greaterThan(0)) ||
      rebasesLoading
    )
      throw new Error('missing dependencies')

    // Pool creation data
    const [a, b] = selectedPoolCurrencies.map((el: Currency) => el.wrapped)
    const [tokenA, tokenB] = a.sortsBefore(b) ? [a, b] : [b, a]
    const deployData = defaultAbiCoder.encode(
      ['address', 'address', 'uint8', 'bool'],
      [...[tokenA.address, tokenB.address].sort(), feeTier, twap]
    )

    // Adding liquidity data
    const indexOfNative = parsedAmounts.findIndex((el: CurrencyAmount<Currency>) => el.currency.isNative)
    const value = indexOfNative > 0 ? { value: parsedAmounts[indexOfNative]?.quotient.toString() } : {}
    const liquidityInput = parsedAmounts.map((el: CurrencyAmount<Currency>, index) => ({
      token: indexOfNative === index && spendFromWallet ? AddressZero : el.currency.wrapped.address,
      native: spendFromWallet,
      amount: spendFromWallet ? el.quotient.toString() : toShareJSBI(rebases[index], el.quotient).toString(),
    }))

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
        defaultAbiCoder.encode(['address'], [account]),
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
    constantProductPoolFactory,
    feeTier,
    i18n,
    masterDeployer,
    parsedAmounts,
    rebases,
    rebasesLoading,
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
