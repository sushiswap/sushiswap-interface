import { useLingui } from '@lingui/react'
import { useActiveWeb3React, useBentoBoxContract, useTridentRouterContract } from '../../../../hooks'
import { useZapAssetInput } from './useZapAssetInput'
import {
  attemptingTxnAtom,
  DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE,
  poolAtom,
  showReviewAtom,
  spendFromWalletSelector,
  txHashAtom,
} from '../atoms'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import ReactGA from 'react-ga'
import { useMemo } from 'react'
import { usePoolDetails } from './usePoolDetails'

export const useClassicZapAddExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const { parsedAmount } = useZapAssetInput()
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const bentoboxContract = useBentoBoxContract()
  const { liquidityMinted } = usePoolDetails([parsedAmount], DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE)

  const execute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const [, pool] = await snapshot.getPromise(poolAtom)

        if (
          !pool ||
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedAmount ||
          !pool?.token0 ||
          !pool?.token1 ||
          !bentoboxContract ||
          !liquidityMinted
        )
          return

        const native = await snapshot.getPromise(spendFromWalletSelector(parsedAmount.currency.wrapped.address))
        const liquidityInput = [
          {
            token: parsedAmount.currency.wrapped.address,
            native,
            amount: await bentoboxContract.toShare(
              parsedAmount.currency.wrapped.address,
              parsedAmount.quotient.toString(),
              false
            ),
          },
        ]

        const encoded = ethers.utils.defaultAbiCoder.encode(['address'], [account])
        const value = parsedAmount.currency.isNative ? { value: parsedAmount.quotient.toString() } : {}

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
              t`Zap ${parsedAmount.toSignificant(3)} ${parsedAmount.currency.symbol} into ${pool.token0.symbol}/${
                pool.token1.symbol
              }`
            ),
          })

          setAttemptingTxn(false)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Zap',
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
      bentoboxContract,
      chainId,
      i18n,
      library,
      liquidityMinted,
      parsedAmount,
      router,
      setAttemptingTxn,
      setShowReview,
      setTxHash,
    ]
  )

  return useMemo(() => ({ execute }), [execute])
}
