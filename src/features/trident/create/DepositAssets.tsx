import React, { FC } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import Alert from '../../../components/Alert'
import AssetInput from '../../../components/AssetInput'
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil'
import { inputAmountsAtom, parsedInputAmountsSelector, selectedPoolCurrenciesAtom } from './atoms'
import { spendFromWalletAtom } from '../context/atoms'
import Button from '../../../components/Button'
import { useCurrencyBalances } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { ZERO } from '@sushiswap/sdk'

const DepositAssets: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const selectedPoolCurrencies = useRecoilValue(selectedPoolCurrenciesAtom)
  const inputAmounts = useRecoilValue(inputAmountsAtom)
  const parsedInputAmounts = useRecoilValue(parsedInputAmountsSelector)
  const [spendFromWallet, setSpendFromWallet] = useRecoilState(spendFromWalletAtom)
  const balances = useCurrencyBalances(account ?? undefined, selectedPoolCurrencies)

  const handleInputAmount = useRecoilCallback<[string, number], void>(({ snapshot, set }) => async (val, index) => {
    const inputAmounts = [...(await snapshot.getPromise(inputAmountsAtom))]
    inputAmounts[index] = val
    set(inputAmountsAtom, inputAmounts)
  })

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : !parsedInputAmounts.every((el) => el?.greaterThan(ZERO))
    ? i18n._(t`Enter an amount`)
    : parsedInputAmounts.some((el, index) => el?.greaterThan(balances[index]))
    ? i18n._(t`Insufficient balance`)
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
      <AssetInput
        value={inputAmounts[1] || ''}
        currency={selectedPoolCurrencies[1]}
        onChange={(val) => handleInputAmount(val, 1)}
        spendFromWallet={spendFromWallet}
      />
      <Button color="gradient" disabled={!!error}>
        {error ? error : i18n._(t`Review & Confirm`)}
      </Button>
    </div>
  )
}

export default DepositAssets
