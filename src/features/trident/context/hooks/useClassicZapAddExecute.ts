import { useLingui } from '@lingui/react'
import { useActiveWeb3React, useBentoBoxContract, useTridentRouterContract } from '../../../../hooks'
import { useZapAssetInput } from './useZapAssetInput'
import { useUserSlippageToleranceWithDefault } from '../../../../state/user/hooks'
import {
  attemptingTxnAtom,
  DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE,
  noLiquiditySelector,
  poolAtom,
  showReviewAtom,
  spendFromWalletAtom,
  txHashAtom,
} from '../atoms'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import { calculateGasMargin, calculateSlippageAmount } from '../../../../functions'
import { ZERO_PERCENT } from '../../../../constants'
import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import ReactGA from 'react-ga'

export const useClassicZapAddExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const { parsedAmount } = useZapAssetInput()
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE) // custom from users
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const bentoboxContract = useBentoBoxContract()

  const execute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const [, pool] = await snapshot.getPromise(poolAtom)
        const noLiquidity = await snapshot.getPromise(noLiquiditySelector)
        const native = await snapshot.getPromise(spendFromWalletAtom)

        if (
          !pool ||
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedAmount ||
          !pool?.token0 ||
          !pool?.token1 ||
          !bentoboxContract
        )
          return

        const amountMin = calculateSlippageAmount(parsedAmount, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0]
        const liquidityInput = [
          {
            token: parsedAmount.currency.wrapped.address,
            native,
            amount: await bentoboxContract.toShare(parsedAmount.currency.wrapped.address, amountMin.toString(), false),
          },
        ]

        const encoded = ethers.utils.defaultAbiCoder.encode(['address'], [account])
        const estimate = router.estimateGas.addLiquidity
        const method = router.addLiquidity
        const args = [liquidityInput, pool.liquidityToken.address, 1, encoded]
        const value = parsedAmount.currency.isNative ? { value: amountMin.toString() } : {}

        try {
          setAttemptingTxn(true)
          const estimatedGasLimit = await estimate(...args, value)
          const tx = await method(...args, {
            ...value,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })

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
      allowedSlippage,
      bentoboxContract,
      chainId,
      i18n,
      library,
      parsedAmount,
      router,
      setAttemptingTxn,
      setShowReview,
      setTxHash,
    ]
  )

  return { execute }
}
