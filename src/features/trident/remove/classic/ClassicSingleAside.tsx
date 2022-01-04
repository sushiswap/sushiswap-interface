import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, WNATIVE } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import { BentoBoxIcon, WalletIcon } from 'app/components/AssetInput/icons'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Divider from 'app/components/Divider'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import BentoBoxFundingSourceModal from 'app/features/trident/add/BentoBoxFundingSourceModal'
import { outputToWalletAtom } from 'app/features/trident/context/atoms'
import { usePoolDetailsBurn } from 'app/features/trident/context/hooks/usePoolDetails'
import useRemovePercentageInput from 'app/features/trident/context/hooks/useRemovePercentageInput'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { useActiveWeb3React } from 'app/services/web3'
import React, { useMemo } from 'react'
import { useRecoilState } from 'recoil'

import TransactionDetails from '../TransactionDetails'

const ClassicSingleAside = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const {
    parsedSLPAmount,
    zapCurrency: [zapCurrency],
    error,
  } = useRemovePercentageInput()
  const { minLiquidityOutputSingleToken } = usePoolDetailsBurn(parsedSLPAmount)
  const minOutputAmount = useMemo(
    () => minLiquidityOutputSingleToken(zapCurrency),
    [minLiquidityOutputSingleToken, zapCurrency]
  )
  const usdcValue = useUSDCValue(minOutputAmount)
  const [outputToWallet, setOutputToWallet] = useRecoilState(outputToWalletAtom)

  return (
    <div className="flex flex-col p-10 rounded bg-dark-1000 shadow-lg gap-8">
      <div className="flex flex-col gap-3">
        <Typography variant="h3" className="text-high-emphesis">
          {i18n._(t`Zap Mode`)}
        </Typography>
        <Typography variant="sm">
          {i18n._(
            t`Select any asset from your wallet or BentoBox balance to invest in this pool.  That asset will be split and converted into the pool assets and deposited in equal value.`
          )}
        </Typography>
      </div>
      <div className="bg-dark-900 rounded p-5 flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <Typography variant="sm">{i18n._(t`Withdraw to:`)}</Typography>
          <Typography variant="sm" className="text-high-emphesis" weight={700}>
            {outputToWallet ? i18n._(t`Wallet`) : i18n._(t`BentoBox`)}
          </Typography>
          <BentoBoxFundingSourceModal />
        </div>
        <Switch
          checked={outputToWallet}
          onChange={() => setOutputToWallet(!outputToWallet)}
          checkedIcon={
            <div className="text-dark-700 flex justify-center items-center h-full w-full">
              <WalletIcon />
            </div>
          }
          uncheckedIcon={
            <div className="text-dark-700 flex justify-center items-center h-full w-full">
              <BentoBoxIcon />
            </div>
          }
        />
      </div>
      {!outputToWallet && zapCurrency.isNative && (
        <Alert
          className="bg-transparent p-0"
          dismissable={false}
          type="error"
          message={i18n._(
            t`Native ${NATIVE[chainId].symbol} can't be withdrawn to BentoBox, ${WNATIVE[chainId].symbol} will be received instead`
          )}
        />
      )}
      <div className="flex flex-col gap-5">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {i18n._(t`You'll Receive (at least):`)}
        </Typography>
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5 items-center">
            <CurrencyLogo currency={minOutputAmount?.currency} size={20} />
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {minOutputAmount?.greaterThan(0) ? minOutputAmount.toSignificant(6) : '0.00'}
            </Typography>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {!outputToWallet && zapCurrency.isNative ? zapCurrency.wrapped.symbol : zapCurrency?.symbol}
            </Typography>
          </div>
          <Typography variant="sm" weight={700} className="text-secondary">
            ≈${usdcValue?.greaterThan(0) ? usdcValue.toSignificant(2) : '0.00'}
          </Typography>
        </div>
        <Divider className="mt-5 border-dark-700" />
        <div className="flex justify-between">
          <Typography variant="lg" weight={700} className="text-high-emphesis">
            {i18n._(t`Total Amount`)}
          </Typography>
          <Typography weight={700} className="text-high-emphesis">
            ≈${usdcValue?.greaterThan(0) ? usdcValue.toSignificant(2) : '0.00'}
          </Typography>
        </div>
      </div>
      <div className={error ? 'opacity-50' : 'opacity-100'}>
        <TransactionDetails />
      </div>
    </div>
  )
}

export default ClassicSingleAside
