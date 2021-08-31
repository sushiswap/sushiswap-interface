import AssetInput from '../../../../components/AssetInput'
import React, { useMemo } from 'react'
import DepositButtons from './../DepositButtons'
import TransactionDetails from './../TransactionDetails'
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import {
  formattedAmountsSelector,
  inputFieldAtom,
  mainInputAtom,
  parsedAmountsSelector,
  poolAtom,
  secondaryInputSelector,
} from './context/atoms'
import { Field } from '../../../../state/trident/add/classic'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useRouterContract } from '../../../../hooks'
import { t } from '@lingui/macro'
import { PairState } from '../../../../hooks/useV2Pairs'
import { useLingui } from '@lingui/react'
import { useCurrencyBalances } from '../../../../state/wallet/hooks'
import { ZERO } from '@sushiswap/sdk'
import Button from '../../../../components/Button'
import { currenciesAtom, fixedRatioAtom, showReviewAtom, spendFromWalletAtom } from '../../context/atoms'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import { maxAmountSpend } from '../../../../functions'

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
  const fixedRatio = useRecoilValue(fixedRatioAtom)
  const router = useRouterContract()
  const [approveA, approveACallback] = useApproveCallback(parsedAmountA, router?.address)
  const [approveB, approveBCallback] = useApproveCallback(parsedAmountB, router?.address)

  const usdcA = useUSDCValue(balances?.[0])
  const usdcB = useUSDCValue(balances?.[1])

  const onMax = useRecoilCallback(
    ({ set }) =>
      async () => {
        if (fixedRatio) {
          usdcA?.lessThan(usdcB)
            ? set(mainInputAtom, maxAmountSpend(balances[0])?.toExact())
            : set(secondaryInputSelector, maxAmountSpend(balances[1])?.toExact())
        }
      },
    [balances, fixedRatio, usdcA, usdcB]
  )

  const isMax = useMemo(() => {
    if (!balances) return false

    if (fixedRatio) {
      return usdcA?.lessThan(usdcB)
        ? parsedAmountA?.equalTo(maxAmountSpend(balances[0]))
        : parsedAmountB?.equalTo(maxAmountSpend(balances[1]))
    } else {
      return parsedAmountA?.equalTo(maxAmountSpend(balances[0])) && parsedAmountB?.equalTo(maxAmountSpend(balances[1]))
    }
  }, [balances, fixedRatio, parsedAmountA, parsedAmountB, usdcA, usdcB])

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === PairState.INVALID
    ? i18n._(t`Invalid pair`)
    : !parsedAmountA?.greaterThan(ZERO) || !parsedAmountB?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : parsedAmountA && balances[0]?.lessThan(parsedAmountA)
    ? i18n._(t`Insufficient ${currencies[0]?.symbol} balance`)
    : parsedAmountB && balances?.length && balances[1]?.lessThan(parsedAmountB)
    ? i18n._(t`Insufficient ${currencies[1]?.symbol} balance`)
    : ''

  return (
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
            <AssetInput.WalletSwitch onChange={() => setSpendFromWallet(!spendFromWallet)} checked={spendFromWallet} />
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
        <div className="grid grid-cols-2 gap-3">
          {[ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveA) && (
            <Button.Dotted pending={approveA === ApprovalState.PENDING} color="blue" onClick={approveACallback}>
              {approveA === ApprovalState.PENDING
                ? i18n._(t`Approving ${parsedAmountA?.currency.symbol}`)
                : i18n._(t`Approve ${parsedAmountA?.currency.symbol}`)}
            </Button.Dotted>
          )}
          {[ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveB) && (
            <Button.Dotted pending={approveB === ApprovalState.PENDING} color="blue" onClick={approveBCallback}>
              {approveB === ApprovalState.PENDING
                ? i18n._(t`Approving ${parsedAmountB?.currency.symbol}`)
                : i18n._(t`Approve ${parsedAmountB?.currency.symbol}`)}
            </Button.Dotted>
          )}
          <div className="col-span-2">
            <DepositButtons errorMessage={error} onMax={onMax} isMaxInput={isMax} onClick={() => setShowReview(true)} />
          </div>
        </div>
      </div>
      {!error && (
        <div className="flex flex-col px-5">
          <TransactionDetails />
        </div>
      )}
    </div>
  )
}

export default ClassicStandardMode
