import { useLingui } from '@lingui/react'
import { useActiveWeb3React, useBentoBoxContract, useTridentRouterContract } from '../../../../hooks'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'
import { attemptingTxnAtom, outputToWalletAtom, poolAtom, poolBalanceAtom, showReviewAtom, txHashAtom } from '../atoms'
import { Percent, ZERO } from '@sushiswap/core-sdk'
import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import ReactGA from 'react-ga'

import { useMemo } from 'react'
import usePercentageInput from './usePercentageInput'

export const useClassicStandardRemoveExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const {
    percentageInput: [percentageInput],
    parsedAmounts,
  } = usePercentageInput()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const setTxHash = useSetRecoilState(txHashAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const bentoboxContract = useBentoBoxContract()

  const execute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const [, pool] = await snapshot.getPromise(poolAtom)
        const [tokenA, tokenB] = [pool?.token0?.wrapped, pool?.token1?.wrapped]
        const liquidityAmount = poolBalance?.multiply(new Percent(percentageInput, '100'))
        const outputToWallet = await snapshot.getPromise(outputToWalletAtom)

        if (
          !pool ||
          !chainId ||
          !library ||
          !account ||
          !router ||
          !parsedAmounts.every((el) => el?.greaterThan(ZERO)) ||
          !tokenA ||
          !tokenB ||
          !liquidityAmount ||
          !bentoboxContract
        )
          throw new Error('missing dependencies')

        const liquidityOutput = await Promise.all(
          parsedAmounts.map(async (el) => ({
            token: el?.currency.wrapped.address,
            amount: await bentoboxContract.toShare(el?.currency.wrapped.address, el?.quotient.toString(), false),
          }))
        )

        const encoded = ethers.utils.defaultAbiCoder.encode(['address', 'bool'], [account, outputToWallet])

        try {
          setAttemptingTxn(true)
          const tx = await router.burnLiquidity(
            pool.liquidityToken.address,
            liquidityAmount.quotient.toString(),
            encoded,
            liquidityOutput
          )

          setTxHash(tx.hash)
          setShowReview(false)
          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(t`Remove ${liquidityAmount?.toSignificant(3)} ${liquidityAmount?.wrapped.currency.symbol}`),
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
      poolBalance,
      percentageInput,
      chainId,
      library,
      account,
      router,
      parsedAmounts,
      bentoboxContract,
      setAttemptingTxn,
      setTxHash,
      setShowReview,
      addTransaction,
      i18n,
    ]
  )

  return useMemo(() => ({ execute }), [execute])
}
