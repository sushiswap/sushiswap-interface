import { useLingui } from '@lingui/react'
import { useActiveWeb3React, useBentoBoxContract, useTridentRouterContract } from '../../../../hooks'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'
import { attemptingTxnAtom, outputToWalletAtom, poolAtom, poolBalanceAtom, showReviewAtom, txHashAtom } from '../atoms'
import { Percent } from '@sushiswap/core-sdk'
import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import ReactGA from 'react-ga'
import { useMemo } from 'react'
import useZapPercentageInput from './useZapPercentageInput'

export const useClassicZapRemoveExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const bentoboxContract = useBentoBoxContract()
  const {
    percentageInput: [percentageInput],
    parsedOutputAmount,
  } = useZapPercentageInput()

  const execute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const [, pool] = await snapshot.getPromise(poolAtom)
        const liquidityAmount = poolBalance?.multiply(new Percent(percentageInput, '100'))
        const outputToWallet = await snapshot.getPromise(outputToWalletAtom)

        if (
          !pool ||
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedOutputAmount ||
          !liquidityAmount ||
          !bentoboxContract
        )
          throw new Error('missing dependencies')

        const liquidityOutput = {
          token: parsedOutputAmount.currency.wrapped.address,
          amount: await bentoboxContract.toShare(
            parsedOutputAmount.currency.wrapped.address,
            parsedOutputAmount.quotient.toString(),
            false
          ),
        }

        const encoded = ethers.utils.defaultAbiCoder.encode(['address', 'bool'], [account, outputToWallet])

        try {
          setAttemptingTxn(true)
          const tx = await router.burnLiquiditySingle(
            pool.liquidityToken.address,
            liquidityAmount.quotient.toString(),
            encoded,
            liquidityOutput
          )

          setTxHash(tx.hash)
          setShowReview(false)
          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(t`Remove ${liquidityAmount?.toSignificant(3)} ${liquidityAmount?.currency.symbol}`),
          })

          setAttemptingTxn(false)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Burn',
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
      parsedOutputAmount,
      percentageInput,
      poolBalance,
      router,
      setAttemptingTxn,
      setShowReview,
      setTxHash,
    ]
  )

  return useMemo(() => ({ execute }), [execute])
}
