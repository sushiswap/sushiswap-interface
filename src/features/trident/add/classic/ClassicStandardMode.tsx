import { ApprovalState, useActiveWeb3React, useApproveCallback, useTridentRouterContract } from '../../../../hooks'
import React, { useMemo } from 'react'
import { currenciesAtom, noLiquiditySelector, showReviewAtom, spendFromWalletAtom } from '../../context/atoms'
import {
  formattedAmountsSelector,
  inputFieldAtom,
  mainInputAtom,
  parsedAmountsSelector,
  poolAtom,
  secondaryInputSelector,
} from './context/atoms'
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import AssetInput from '../../../../components/AssetInput'
import Button from '../../../../components/Button'
import { ConstantProductPoolState } from '../../../../hooks/useTridentClassicPools'
import DepositButtons from './../DepositButtons'
import { Field } from '../../../../state/trident/add/classic'
import TransactionDetails from './../TransactionDetails'
import { ZERO } from '@sushiswap/sdk'
import { maxAmountSpend } from '../../../../functions'
import { t } from '@lingui/macro'
import { useCurrencyBalances } from '../../../../state/wallet/hooks'
import { useLingui } from '@lingui/react'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import TridentApproveGate from '../../ApproveButton'
import Alert from '../../../../components/Alert'

const ClassicStandardMode = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [poolState] = useRecoilValue(poolAtom)
  const [parsedAmountA, parsedAmountB] = useRecoilValue(parsedAmountsSelector)
  const formattedAmounts = useRecoilValue(formattedAmountsSelector)

  const setInputField = useSetRecoilState(inputFieldAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const currencies = useRecoilValue(currenciesAtom)
  const setMainInput = useSetRecoilState(mainInputAtom)
  const setSecondaryInput = useSetRecoilState(secondaryInputSelector)

  const [spendFromWallet, setSpendFromWallet] = useRecoilState(spendFromWalletAtom)
  const balances = useCurrencyBalances(account ?? undefined, currencies)
  const router = useTridentRouterContract()
  const [approveA, approveACallback] = useApproveCallback(parsedAmountA, router?.address)
  const [approveB, approveBCallback] = useApproveCallback(parsedAmountB, router?.address)
  const noLiquidity = useRecoilValue(noLiquiditySelector)

  const usdcA = useUSDCValue(balances?.[0])
  const usdcB = useUSDCValue(balances?.[1])

  const onMax = useRecoilCallback(
    ({ set }) =>
      async () => {
        if (!noLiquidity) {
          usdcA?.lessThan(usdcB)
            ? set(mainInputAtom, maxAmountSpend(balances[0])?.toExact())
            : set(secondaryInputSelector, maxAmountSpend(balances[1])?.toExact())
        }
      },
    [balances, noLiquidity, usdcA, usdcB]
  )

  const isMax = useMemo(() => {
    if (!balances) return false

    if (!noLiquidity) {
      return usdcA?.lessThan(usdcB)
        ? parsedAmountA?.equalTo(maxAmountSpend(balances[0]))
        : parsedAmountB?.equalTo(maxAmountSpend(balances[1]))
    } else {
      return parsedAmountA?.equalTo(maxAmountSpend(balances[0])) && parsedAmountB?.equalTo(maxAmountSpend(balances[1]))
    }
  }, [balances, noLiquidity, parsedAmountA, parsedAmountB, usdcA, usdcB])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === ConstantProductPoolState.INVALID
    ? i18n._(t`Invalid pair`)
    : !parsedAmountA?.greaterThan(ZERO) || !parsedAmountB?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : parsedAmountA && balances[0]?.lessThan(parsedAmountA)
    ? i18n._(t`Insufficient ${currencies[0]?.symbol} balance`)
    : parsedAmountB && balances?.length && balances[1]?.lessThan(parsedAmountB)
    ? i18n._(t`Insufficient ${currencies[1]?.symbol} balance`)
    : ''

  return (
    <>
      {poolState === ConstantProductPoolState.NOT_EXISTS && (
        <div className="px-5 pt-5">
          <Alert
            dismissable={false}
            type="error"
            showIcon
            message={i18n._(t`A Pool could not be found for selected parameters`)}
          />
        </div>
      )}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 px-5">
          <AssetInput
            value={formattedAmounts[0]}
            currency={currencies[0]}
            onChange={(val) => {
              setInputField(Field.CURRENCY_A)
              setMainInput(val)
            }}
            headerRight={
              <AssetInput.WalletSwitch
                onChange={() => setSpendFromWallet(!spendFromWallet)}
                checked={spendFromWallet}
              />
            }
            spendFromWallet={spendFromWallet}
          />
          <AssetInput
            value={formattedAmounts[1]}
            currency={currencies[1]}
            onChange={(val) => {
              setInputField(Field.CURRENCY_B)
              setSecondaryInput(val)
            }}
            spendFromWallet={spendFromWallet}
          />
          <div className="flex flex-col gap-3">
            <TridentApproveGate inputAmounts={[parsedAmountA, parsedAmountB]}>
              {({ approved }) => (
                <DepositButtons
                  disabled={!!error || !approved}
                  errorMessage={error}
                  onMax={onMax}
                  isMaxInput={isMax}
                  onClick={() => setShowReview(true)}
                />
              )}
            </TridentApproveGate>
          </div>
        </div>
        {!error && (
          <div className="flex flex-col px-5">
            <TransactionDetails />
          </div>
        )}
      </div>
    </>
  )
}

export default ClassicStandardMode
