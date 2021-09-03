import { atom, selector, useRecoilCallback, useSetRecoilState } from 'recoil'
import { PoolType } from '../types'
import { Currency, CurrencyAmount, Price } from '@sushiswap/sdk'
import { calculateGasMargin, tryParseAmount } from '../../../functions'
import { attemptingTxnAtom, showReviewAtom, spendFromWalletAtom, txHashAtom } from '../context/atoms'
import { useConstantProductPoolFactory, useMasterDeployerContract } from '../../../hooks'
import { ethers } from 'ethers'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { t } from '@lingui/macro'
import ReactGA from 'react-ga'
import { useLingui } from '@lingui/react'

export const selectedPoolTypeAtom = atom<PoolType>({
  key: 'selectedPoolTypeAtom',
  default: PoolType.CLASSIC,
})

export const pageAtom = atom<number>({
  key: 'pageAtom',
  default: 0,
})

export const twapAtom = atom<boolean>({
  key: 'twapAtom',
  default: true,
})

export const selectedPoolCurrenciesAtom = atom<Currency[]>({
  key: 'selectedPoolCurrenciesAtom',
  default: [],
})

export const feeTierAtom = atom<number>({
  key: 'feeTierAtom',
  default: null,
})

export const inputAmountsAtom = atom<string[]>({
  key: 'inputAmountsAtom',
  default: [],
})

export const parsedInputAmountsSelector = selector<CurrencyAmount<Currency>[]>({
  key: 'parsedInputAmounts',
  get: ({ get }) => {
    const inputAmounts = get(inputAmountsAtom)
    const selectedPoolCurrencies = get(selectedPoolCurrenciesAtom)
    return inputAmounts.map((amount, index) => tryParseAmount(amount, selectedPoolCurrencies[index]))
  },
})

export const priceSelector = selector<Price<Currency, Currency>>({
  key: 'priceSelector',
  get: ({ get }) => {
    const parsedInputAmounts = get(parsedInputAmountsSelector)
    if (parsedInputAmounts.length === 2) {
      const [parsedInputA, parsedInputB] = parsedInputAmounts
      if (parsedInputA?.greaterThan(0) && parsedInputB?.greaterThan(0)) {
        const value = parsedInputB.divide(parsedInputA)
        return new Price(parsedInputA.currency, parsedInputB.currency, value.denominator, value.numerator)
      }
    }

    return undefined
  },
})

export const useCreateExecute = () => {
  const { i18n } = useLingui()
  const masterDeployer = useMasterDeployerContract(true)
  const constantProductPoolFactory = useConstantProductPoolFactory(true)
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)

  // TODO Doesn't add liquidity yet, merely creates the pool
  const classicExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const selectedPoolCurrencies = await snapshot.getPromise(selectedPoolCurrenciesAtom)
        const parsedInputAmounts = await snapshot.getPromise(parsedInputAmountsSelector)
        const spendFromWallet = await snapshot.getPromise(spendFromWalletAtom)
        const feeTier = await snapshot.getPromise(feeTierAtom)
        const twap = await snapshot.getPromise(twapAtom)

        if (
          !masterDeployer ||
          !constantProductPoolFactory ||
          !selectedPoolCurrencies[0] ||
          !selectedPoolCurrencies[1] ||
          !feeTier
        )
          throw new Error('missing dependencies')

        console.log([...selectedPoolCurrencies.map((el) => el.wrapped.address).sort(), feeTier, twap])
        const estimate = masterDeployer.estimateGas.deployPool
        const method = masterDeployer.deployPool
        const deployData = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'uint8', 'bool'],
          [...selectedPoolCurrencies.map((el) => el.wrapped.address).sort(), 50, twap]
        )

        try {
          setAttemptingTxn(true)
          const estimatedGasLimit = await estimate(constantProductPoolFactory.address, deployData, {})
          const response = await method(constantProductPoolFactory.address, deployData, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })

          setAttemptingTxn(false)

          addTransaction(response, {
            summary: i18n._(
              t`Create pool for tokens ${selectedPoolCurrencies[0].symbol} and ${selectedPoolCurrencies[1].symbol}`
            ),
          })

          setTxHash(response.hash)
          setShowReview(false)

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
      },
    [addTransaction, constantProductPoolFactory, i18n, masterDeployer, setAttemptingTxn, setShowReview, setTxHash]
  )

  const hybridExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const selectedPoolCurrencies = await snapshot.getPromise(selectedPoolCurrenciesAtom)
        const parsedInputAmounts = await snapshot.getPromise(parsedInputAmountsSelector)
        const spendFromWallet = await snapshot.getPromise(spendFromWalletAtom)
      },
    []
  )

  const weightedExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const selectedPoolCurrencies = await snapshot.getPromise(selectedPoolCurrenciesAtom)
        const parsedInputAmounts = await snapshot.getPromise(parsedInputAmountsSelector)
        const spendFromWallet = await snapshot.getPromise(spendFromWalletAtom)
      },
    []
  )

  const concentratedExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const selectedPoolCurrencies = await snapshot.getPromise(selectedPoolCurrenciesAtom)
        const parsedInputAmounts = await snapshot.getPromise(parsedInputAmountsSelector)
        const spendFromWallet = await snapshot.getPromise(spendFromWalletAtom)
      },
    []
  )

  return {
    classicExecute,
    hybridExecute,
    weightedExecute,
    concentratedExecute,
  }
}
