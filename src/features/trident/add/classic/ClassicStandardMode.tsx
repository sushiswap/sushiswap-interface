import AssetInput from '../../../../components/AssetInput'
import React from 'react'
import DepositButtons from './../DepositButtons'
import TransactionDetails from './../TransactionDetails'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import {
  currenciesAtom,
  formattedAmountsSelector,
  inputFieldAtom,
  mainInputAtom,
  parsedAmountsSelector,
  poolAtom,
  secondaryInputSelector,
  showReviewAtom,
  spendFromWalletAtom,
} from './context/atoms'
import { Field } from '../../../../state/trident/add/classic'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useRouterContract } from '../../../../hooks'
import { t } from '@lingui/macro'
import { PairState } from '../../../../hooks/useV2Pairs'
import { useLingui } from '@lingui/react'
import { useCurrencyBalances } from '../../../../state/wallet/hooks'
import { ZERO } from '@sushiswap/sdk'
import Button from '../../../../components/Button'

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

  const router = useRouterContract()
  const [approveA, approveACallback] = useApproveCallback(parsedAmountA, router?.address)
  const [approveB, approveBCallback] = useApproveCallback(parsedAmountB, router?.address)

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

        <div className="flex flex-col">
          <div className="flex flex-row gap-3">
            {approveA === ApprovalState.NOT_APPROVED && (
              <Button color="blue" onClick={approveACallback}>
                Approve {parsedAmountA?.currency.symbol}
              </Button>
            )}
            {approveB === ApprovalState.NOT_APPROVED && (
              <Button color="blue" onClick={approveBCallback}>
                Approve {parsedAmountB?.currency.symbol}
              </Button>
            )}
          </div>
          {approveA === ApprovalState.APPROVED && approveB === ApprovalState.APPROVED && (
            <DepositButtons
              errorMessage={error}
              inputValid={true}
              onMax={() => {}}
              isMaxInput={false}
              onClick={() => setShowReview(true)}
            />
          )}
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
