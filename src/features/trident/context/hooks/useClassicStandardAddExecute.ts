import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { toHex } from '@sushiswap/core-sdk'
import { approveMasterContractAction } from 'app/features/trident/context/actions'
import { batchAction, getAsEncodedAction } from 'app/features/trident/context/hooks/actions'
import TridentApproveGate from 'app/features/trident/TridentApproveGate'
import { toShareJSBI } from 'app/functions'
import { useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import ReactGA from 'react-ga'
import { useRecoilCallback, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'

import { LiquidityInput } from '../../types'
import { attemptingTxnAtom, bentoboxRebasesAtom, poolAtom, spendFromWalletSelector } from '../atoms'
import { useDependentAssetInputs } from './useDependentAssetInputs'
import { usePoolDetailsMint } from './usePoolDetails'

export const useClassicStandardAddExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const { parsedAmounts } = useDependentAssetInputs()
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()
  const setAttemptingTxn = useSetRecoilState(attemptingTxnAtom)
  const rebases = useRecoilValue(bentoboxRebasesAtom)
  const { liquidityMinted } = usePoolDetailsMint(parsedAmounts)
  const bentoPermit = useRecoilValue(TridentApproveGate.bentoPermit)
  const resetBentoPermit = useResetRecoilState(TridentApproveGate.bentoPermit)

  return useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const { pool } = await snapshot.getPromise(poolAtom)
        const [parsedAmountA, parsedAmountB] = parsedAmounts
        const nativeA = await snapshot.getPromise(spendFromWalletSelector(0))
        const nativeB = await snapshot.getPromise(spendFromWalletSelector(1))

        if (!pool || !chainId || !library || !account || !router || !liquidityMinted) return

        let value = '0x0'
        const liquidityInput: LiquidityInput[] = []
        const encoded = defaultAbiCoder.encode(['address'], [account])

        if (parsedAmountA) {
          if (parsedAmountA.currency.isNative && nativeA) {
            value = toHex(parsedAmountA)
          }

          liquidityInput.push({
            token: parsedAmountA.currency.isNative && nativeA ? AddressZero : parsedAmountA.currency.wrapped.address,
            native: nativeA,
            amount: nativeA
              ? parsedAmountA.quotient.toString()
              : toShareJSBI(rebases[parsedAmountA.wrapped.currency.address], parsedAmountA.quotient).toString(),
          })
        }

        if (parsedAmountB) {
          if (parsedAmountB.currency.isNative && nativeB) {
            value = toHex(parsedAmountB)
          }

          liquidityInput.push({
            token: parsedAmountB.currency.isNative && nativeB ? AddressZero : parsedAmountB.currency.wrapped.address,
            native: nativeB,
            amount: nativeB
              ? parsedAmountB.quotient.toString()
              : toShareJSBI(rebases[parsedAmountB.wrapped.currency.address], parsedAmountB.quotient).toString(),
          })
        }

        if (liquidityInput.length === 0) return

        try {
          setAttemptingTxn(true)
          const tx = await library.getSigner().sendTransaction({
            from: account,
            to: router.address,
            data: batchAction({
              contract: router,
              actions: [
                approveMasterContractAction({ router, signature: bentoPermit }),
                getAsEncodedAction({
                  contract: router,
                  fn: 'addLiquidity',
                  args: [liquidityInput, pool.liquidityToken.address, liquidityMinted.quotient.toString(), encoded],
                }),
              ],
            }),
            value,
          })

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

          resetBentoPermit()
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
      parsedAmounts,
      chainId,
      library,
      account,
      router,
      liquidityMinted,
      rebases,
      setAttemptingTxn,
      bentoPermit,
      addTransaction,
      i18n,
      resetBentoPermit,
    ]
  )
}
