import React, { FC } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Alert from '../../../components/Alert'
import AssetInput from '../../../components/AssetInput'
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { inputAmountsAtom, parsedInputAmountsSelector, selectedPoolCurrenciesAtom } from './atoms'
import { showReviewAtom, spendFromWalletAtom } from '../context/atoms'
import Button from '../../../components/Button'
import { useCurrencyBalances } from '../../../state/wallet/hooks'
import { ApprovalState, useActiveWeb3React, useApproveCallback, useTridentRouterContract } from '../../../hooks'
import { ZERO } from '@sushiswap/sdk'

const ClassicDepositAssets: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const router = useTridentRouterContract()
  const selectedPoolCurrencies = useRecoilValue(selectedPoolCurrenciesAtom)
  const inputAmounts = useRecoilValue(inputAmountsAtom)
  const [parsedAmountA, parsedAmountB] = useRecoilValue(parsedInputAmountsSelector)
  const [spendFromWallet, setSpendFromWallet] = useRecoilState(spendFromWalletAtom)
  const balances = useCurrencyBalances(account ?? undefined, selectedPoolCurrencies)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const [approveA, approveACallback] = useApproveCallback(parsedAmountA, router?.address)
  const [approveB, approveBCallback] = useApproveCallback(parsedAmountB, router?.address)

  const handleInputAmount = useRecoilCallback<[string, number], void>(({ snapshot, set }) => async (val, index) => {
    const inputAmounts = [...(await snapshot.getPromise(inputAmountsAtom))]
    inputAmounts[index] = val
    set(inputAmountsAtom, inputAmounts)
  })

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : ![parsedAmountA, parsedAmountB].every((el) => el?.greaterThan(ZERO))
    ? i18n._(t`Enter an amount`)
    : parsedAmountA?.greaterThan(balances[0])
    ? i18n._(t`Insufficient ${parsedAmountA?.currency.symbol} balance`)
    : parsedAmountB?.greaterThan(balances[0])
    ? i18n._(t`Insufficient ${parsedAmountB?.currency.symbol} balance`)
    : ''

  return (
    <div className="flex flex-col p-5 gap-5">
      <div className="flex flex-row gap-3 justify-between">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`Deposit Assets`)}
        </Typography>
      </div>
      <Alert
        type="information"
        message={i18n._(
          t`When creating a pair you are the first liquidity provider. The ratio of tokens you add will set the price of this pool. Once you are happy with the rate, click ‘Create Pool’.`
        )}
        dismissable={false}
      />
      <AssetInput
        value={inputAmounts[0] || ''}
        currency={selectedPoolCurrencies[0]}
        onChange={(val) => handleInputAmount(val, 0)}
        headerRight={
          <AssetInput.WalletSwitch onChange={() => setSpendFromWallet(!spendFromWallet)} checked={spendFromWallet} />
        }
        spendFromWallet={spendFromWallet}
      />
      <div className="flex flex-col gap-3">
        <AssetInput
          value={inputAmounts[1] || ''}
          currency={selectedPoolCurrencies[1]}
          onChange={(val) => handleInputAmount(val, 1)}
          spendFromWallet={spendFromWallet}
        />
        {([ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveA) ||
          [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveB)) && (
          <div className="flex gap-3">
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
          </div>
        )}
        <Button
          color="gradient"
          /*TODO uncomment*/
          // disabled={
          //   !!error ||
          //   [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveA) ||
          //   [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approveB)
          // }
          onClick={() => setShowReview(true)}
        >
          {error ? error : i18n._(t`Review & Confirm`)}
        </Button>
      </div>
    </div>
  )
}

export default ClassicDepositAssets
