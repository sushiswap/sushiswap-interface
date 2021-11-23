import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, WNATIVE } from '@sushiswap/core-sdk'
import Alert from 'app/components/Alert'
import { usePoolDetailsBurn } from 'app/features/trident/context/hooks/usePoolDetails'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'
import { useRecoilState } from 'recoil'

import { BentoBoxIcon, WalletIcon } from '../../../../components/AssetInput/icons'
import CurrencyLogo from '../../../../components/CurrencyLogo'
import Divider from '../../../../components/Divider'
import Switch from '../../../../components/Switch'
import Typography from '../../../../components/Typography'
import { useUSDCValue } from '../../../../hooks/useUSDCPrice'
import BentoBoxFundingSourceModal from '../../add/BentoBoxFundingSourceModal'
import { outputToWalletAtom } from '../../context/atoms'
import useRemovePercentageInput from '../../context/hooks/useRemovePercentageInput'
import SumUSDCValues from '../../SumUSDCValues'
import TransactionDetails from '../TransactionDetails'

const ClassicStandardAside = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const {
    parsedSLPAmount,
    error,
    receiveNative: [receiveNative],
  } = useRemovePercentageInput()
  const { minLiquidityOutput } = usePoolDetailsBurn(parsedSLPAmount)
  const usdcValues = [useUSDCValue(minLiquidityOutput?.[0]), useUSDCValue(minLiquidityOutput?.[1])]
  const [outputToWallet, setOutputToWallet] = useRecoilState(outputToWalletAtom)

  return (
    <div className="flex flex-col p-10 rounded bg-dark-1000 shadow-lg gap-8">
      <div className="flex flex-col gap-3">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`Standard Mode`)}
        </Typography>
        <Typography variant="sm">
          {i18n._(
            t`You can withdraw to one or both of these assets, in any amount.  If you would like to receive your investment as another token (e.g. in USDC), then withdraw using Zap mode.`
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
      {!outputToWallet && receiveNative && (
        <Alert
          className="bg-transparent px-0 pb-0 pt-0"
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
        {minLiquidityOutput.map((el, index) => (
          <div className="flex justify-between items-center" key={index}>
            <div className="flex gap-1.5 items-center">
              <CurrencyLogo currency={el?.currency} size={20} />
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {el?.greaterThan(0) ? el.toSignificant(6) : '0.00'}
              </Typography>
              <Typography variant="sm" weight={700} className="text-high-emphesis">
                {el?.currency.wrapped.address === WNATIVE[chainId].address && receiveNative && outputToWallet
                  ? NATIVE[chainId].symbol
                  : el?.currency.symbol}
              </Typography>
            </div>
            <Typography variant="sm" weight={700} className="text-secondary">
              ≈${usdcValues[index]?.greaterThan(0) ? usdcValues[index]?.toSignificant(6) : '0.00'}
            </Typography>
          </div>
        ))}
        <div className="flex flex-col gap-4">
          <Divider className="mt-5 border-dark-700" />
          <div className="flex justify-between">
            <Typography weight={700} className="text-high-emphesis">
              {i18n._(t`Total Amount`)}
            </Typography>
            <Typography weight={700} className="text-high-emphesis">
              <SumUSDCValues amounts={minLiquidityOutput}>
                {({ amount }) => (amount ? `≈$${amount?.toSignificant(6)}` : '≈$0.00')}
              </SumUSDCValues>
            </Typography>
          </div>
        </div>
      </div>
      <div className={classNames('mt-4', error ? 'opacity-50' : 'opacity-100')}>
        <TransactionDetails />
      </div>
    </div>
  )
}

export default ClassicStandardAside
