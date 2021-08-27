import Alert from '../../../../components/Alert'
import { t } from '@lingui/macro'
import Button from '../../../../components/Button'
import { useLingui } from '@lingui/react'
import Typography from '../../../../components/Typography'
import AssetInput from '../../../../components/AssetInput'
import TransactionDetails from './../TransactionDetails'
import React from 'react'
import {
  parsedZapAmountSelector,
  poolAtom,
  selectedZapCurrencyAtom,
  showReviewAtom,
  zapInputAtom,
} from './context/atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { PairState } from '../../../../hooks/useV2Pairs'
import { useActiveWeb3React } from '../../../../hooks'
import { useCurrencyBalance } from '../../../../state/wallet/hooks'

const ClassicZapMode = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const [poolState] = useRecoilValue(poolAtom)
  const [zapInput, setZapInput] = useRecoilState(zapInputAtom)
  const parsedZapAmount = useRecoilValue(parsedZapAmountSelector)
  const [selectedZapCurrency, setSelectedZapCurrency] = useRecoilState(selectedZapCurrencyAtom)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const balance = useCurrencyBalance(account ?? undefined, selectedZapCurrency)

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === PairState.INVALID
    ? i18n._(t`Invalid pair`)
    : !zapInput
    ? i18n._(t`Enter an amount`)
    : parsedZapAmount && balance?.lessThan(parsedZapAmount)
    ? i18n._(t`Insufficient ${selectedZapCurrency?.symbol} balance`)
    : ''

  return (
    <>
      <div className="px-5">
        <Alert
          dismissable={false}
          type="information"
          showIcon
          message={i18n._(t`In Zap mode, your selected asset will be split and rebalanced into the corresponding tokens and their weights
          automatically.`)}
        />
      </div>
      <div className="flex flex-col gap-4 px-5">
        <AssetInput
          value={zapInput}
          currency={selectedZapCurrency}
          onChange={setZapInput}
          onSelect={setSelectedZapCurrency}
        />
        <Button
          color={zapInput ? 'gradient' : 'gray'}
          disabled={!!error}
          className="font-bold text-sm"
          onClick={() => setShowReview(true)}
        >
          {!error ? i18n._(t`Confirm Deposit`) : error}
        </Button>
      </div>
      <div className="flex flex-col gap-4 px-5 mt-8">
        <Typography weight={700} className="text-high-emphesis">
          {selectedZapCurrency
            ? i18n._(t`Your ${selectedZapCurrency.symbol} will be split into:`)
            : i18n._(t`Your selected token will be split into:`)}
        </Typography>
        {/*<ListPanel*/}
        {/*  items={Object.values(parsedOutputAmounts).map((amount, index) => (*/}
        {/*    <ListPanel.CurrencyAmountItem amount={amount} key={index} />*/}
        {/*  ))}*/}
        {/*/>*/}
      </div>
      {!error && (
        <div className="mt-6 px-5">
          <TransactionDetails />
        </div>
      )}
    </>
  )
}

export default ClassicZapMode
