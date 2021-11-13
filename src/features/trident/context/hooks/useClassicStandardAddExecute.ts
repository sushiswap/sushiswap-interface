import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { toShareJSBI } from 'app/functions'
import { useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useMemo } from 'react'
import ReactGA from 'react-ga'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'

import { LiquidityInput } from '../../types'
import {
  attemptingTxnAtom,
  bentoboxRebasesAtom,
  poolAtom,
  showReviewAtom,
  spendFromWalletSelector,
  txHashAtom,
} from '../atoms'
import { useDependentAssetInputs } from './useDependentAssetInputs'
import { usePoolDetailsMint } from './usePoolDetails'

export const useClassicStandardAddExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const { parsedAmounts } = useDependentAssetInputs()
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const { liquidityMinted } = usePoolDetailsMint(parsedAmounts)

  const execute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const { pool } = await snapshot.getPromise(poolAtom)
        const [parsedAmountA, parsedAmountB] = parsedAmounts
        const nativeA = await snapshot.getPromise(spendFromWalletSelector(pool?.token0.address))
        const nativeB = await snapshot.getPromise(spendFromWalletSelector(pool?.token1.address))

        if (!pool || !chainId || !library || !account || !router || !liquidityMinted) return

        let value = {}
        const liquidityInput: LiquidityInput[] = []
        const encoded = defaultAbiCoder.encode(['address'], [account])

        if (parsedAmountA && rebases[parsedAmountA.wrapped.currency.address]) {
          value = parsedAmountA.currency.isNative ? { value: parsedAmountA.quotient.toString() } : {}
          liquidityInput.push({
            token: parsedAmountA.currency.isNative ? AddressZero : parsedAmountA.currency.wrapped.address,
            native: nativeA,
            amount: nativeA
              ? parsedAmountA.quotient.toString()
              : toShareJSBI(rebases[parsedAmountA.wrapped.currency.address], parsedAmountA.quotient).toString(),
          })
        }

        if (parsedAmountB && rebases[parsedAmountB.wrapped.currency.address]) {
          value = parsedAmountB.currency.isNative ? { value: parsedAmountB.quotient.toString() } : {}
          liquidityInput.push({
            token: parsedAmountB.currency.isNative ? AddressZero : parsedAmountB.currency.wrapped.address,
            native: nativeB,
            amount: nativeB
              ? parsedAmountB.quotient.toString()
              : toShareJSBI(rebases[parsedAmountB.wrapped.currency.address], parsedAmountB.quotient).toString(),
          })
        }

        if (liquidityInput.length === 0) return

        try {
          setAttemptingTxn(true)
          const tx = await router.addLiquidity(
            liquidityInput,
            pool.liquidityToken.address,
            liquidityMinted.quotient.toString(),
            encoded,
            value
          )

          setTxHash(tx.hash)
          setShowReview(false)
          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(
              t`Add ${parsedAmountA?.toSignificant(3)} ${
                parsedAmountA?.currency.symbol
              } and ${parsedAmountB?.toSignificant(3)} ${parsedAmountB?.currency.symbol} into ${pool.token0.symbol}/${
                pool.token1.symbol
              }`
            ),
          })

          setAttemptingTxn(false)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
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
      parsedAmounts,
      chainId,
      library,
      account,
      router,
      rebases,
      liquidityMinted,
      setAttemptingTxn,
      setTxHash,
      setShowReview,
      addTransaction,
      i18n,
    ]
  )

  return useMemo(() => ({ execute }), [execute])
}
