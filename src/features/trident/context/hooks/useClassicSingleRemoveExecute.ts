import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { approveMasterContractAction, approveSLPAction } from 'app/features/trident/context/actions'
import { batchAction, burnLiquiditySingleAction, unwrapWETHAction } from 'app/features/trident/context/hooks/actions'
import { usePoolDetailsBurn } from 'app/features/trident/context/hooks/usePoolDetails'
import useRemovePercentageInput from 'app/features/trident/context/hooks/useRemovePercentageInput'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { toShareJSBI } from 'app/functions'
import { useTridentRouterContract } from 'app/hooks'
import { useBentoRebase } from 'app/hooks/useBentoRebases'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useMemo } from 'react'
import ReactGA from 'react-ga'
import { useRecoilCallback, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import { attemptingTxnAtom, poolAtom } from '../atoms'

export const useClassicSingleRemoveExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const {
    parsedSLPAmount,
    zapCurrency: [zapCurrency],
    outputToWallet,
  } = useRemovePercentageInput()
  const { minLiquidityOutputSingleToken } = usePoolDetailsBurn(parsedSLPAmount)
  const { rebase } = useBentoRebase(zapCurrency?.wrapped)
  const minOutputAmount = useMemo(
    () => minLiquidityOutputSingleToken(zapCurrency?.wrapped),
    [minLiquidityOutputSingleToken, zapCurrency?.wrapped]
  )
  const bentoPermit = useRecoilValue(TridentApproveGate.bentoPermit)
  const resetBentoPermit = useResetRecoilState(TridentApproveGate.bentoPermit)
  const slpPermit = useRecoilValue(TridentApproveGate.slpPermit)
  const resetSLPPermit = useResetRecoilState(TridentApproveGate.slpPermit)

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const { pool } = await snapshot.getPromise(poolAtom)

        if (!pool || !chainId || !library || !account || !router || !minOutputAmount || !rebase || !parsedSLPAmount)
          throw new Error('missing dependencies')

        const receiveETH = zapCurrency?.isNative && outputToWallet
        const actions = [
          approveMasterContractAction({ router, signature: bentoPermit }),
          approveSLPAction({ router, signatureData: slpPermit }),
          burnLiquiditySingleAction({
            router,
            address: pool.liquidityToken.address,
            token: minOutputAmount.currency.wrapped.address,
            amount: parsedSLPAmount.quotient.toString(),
            recipient: receiveETH ? router.address : account,
            minWithdrawal: toShareJSBI(rebase, minOutputAmount.quotient).toString(),
            receiveToWallet: outputToWallet,
          }),
        ]

        if (receiveETH)
          actions.push(
            unwrapWETHAction({
              router,
              amountMinimum: toShareJSBI(rebase, minOutputAmount.quotient).toString(),
              recipient: account,
            })
          )

        try {
          setAttemptingTxn(true)
          const tx = await library.getSigner().sendTransaction({
            from: account,
            to: router.address,
            data: batchAction({
              contract: router,
              actions,
            }),
            value: '0x0',
          })

          await tx.wait()

          addTransaction(tx, {
            summary: i18n._(t`Remove ${parsedSLPAmount?.toSignificant(3)} ${parsedSLPAmount?.currency.symbol}`),
          })

          setAttemptingTxn(false)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Burn',
            label: [pool.token0.symbol, pool.token1.symbol].join('/'),
          })

          resetBentoPermit()
          resetSLPPermit()
          return tx
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
      bentoPermit,
      chainId,
      i18n,
      library,
      minOutputAmount,
      outputToWallet,
      parsedSLPAmount,
      rebase,
      resetBentoPermit,
      resetSLPPermit,
      router,
      setAttemptingTxn,
      slpPermit,
      zapCurrency?.isNative,
    ]
  )
}
