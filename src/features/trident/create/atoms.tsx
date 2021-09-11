import { atom, selector, useRecoilCallback, useSetRecoilState } from 'recoil'
import { Currency, CurrencyAmount, PoolType, Price } from '@sushiswap/sdk'
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
  default: PoolType.ConstantProduct,
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
  default: [null, null],
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
  const masterDeployer = useMasterDeployerContract()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)

  // TODO Doesn't add liquidity yet, merely creates the pool
  const classicExecute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const selectedPoolCurrencies = await snapshot.getPromise(selectedPoolCurrenciesAtom)
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
