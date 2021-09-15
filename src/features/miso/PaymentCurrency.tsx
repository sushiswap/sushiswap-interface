import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'

import Typography from '../../components/Typography'
import { classNames } from '../../functions/styling'
import PaymentCustomOption from './PaymentCustomOption'
import PaymentOption from './PaymentOption'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

export default function ({ className, label, paymentCurrency, onChange }: any) {
  const { i18n } = useLingui()
  const [_alertVisible, showAlert] = React.useState(false)

  const node = React.useRef<HTMLDivElement>()
  useOnClickOutside(node, () => showAlert(false))

  return (
    <div
      className={classNames('mb-3 mt-8', className)}
      onClick={() => {
        showAlert(true)
      }}
      ref={node}
    >
      <Typography className="text-primary text-xl">{i18n._(`${label}`)}</Typography>
      <div className="flex items-center">
        <div className="flex-1 grid grid-cols-12 gap-3 my-3 pr-3">
          <PaymentOption
            className="col-span-6"
            title="ETHEREUM"
            description="Most Common"
            onSelected={() => onChange('ETH')}
            selected={paymentCurrency == 'ETH'}
          />
          <PaymentOption
            className="col-span-6"
            title="SUSHI"
            description="Our Favorite"
            onSelected={() => onChange('SUSHI')}
            selected={paymentCurrency == 'SUSHI'}
          />
          <PaymentOption
            className="col-span-4 flex-1"
            title="DAI"
            description=""
            onSelected={() => onChange('DAI')}
            selected={paymentCurrency == 'DAI'}
          />
          <PaymentOption
            className="col-span-4 flex-1"
            title="USDCOIN"
            description=""
            onSelected={() => onChange('USDC')}
            selected={paymentCurrency == 'USDC'}
          />
          <PaymentOption
            className="col-span-4 flex-1"
            title="TETHER(USDT)"
            description=""
            onSelected={() => onChange('USDT')}
            selected={paymentCurrency == 'USDT'}
          />
          <PaymentCustomOption
            className="col-span-12"
            onSelected={() => onChange('CUSTOM')}
            selected={paymentCurrency == 'CUSTOM'}
          />
        </div>
        <div className="w-[200px]">
          <Typography className="w-[200px] ml-3 my-auto text-low-emphesis">{i18n._(t`Stablecoins`)}</Typography>
        </div>
      </div>
      <div className="mr-[200px] pr-3">
        {_alertVisible && (
          <div className="flex flex-row bg-purple bg-opacity-20 space-x-3 mt-2 px-4 py-3 rounded">
            <ExclamationCircleIcon className="w-[24px] h-[24px] text-purple" />
            <Typography className="flex-1 text-sm text-primary">
              {i18n._(
                t`Select the currency you want to accept as payment during the auction.  ETH is the most common, but some also prefer to use stablecoins like DAI or USDC.  However, you can also accept any ERC-20 you like by providing it’s address in the custom field.`
              )}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}
