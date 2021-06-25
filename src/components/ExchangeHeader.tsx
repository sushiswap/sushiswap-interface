import { ChainId, Currency, Percent, WNATIVE } from '@sushiswap/sdk'
import React, { FC, useState } from 'react'

import Gas from './Gas'
import Lottie from 'lottie-react'
import NavLink from './NavLink'
import Settings from './Settings'
import { currencyId } from '../functions'
import profileAnimationData from '../animation/wallet.json'
import settingsAnimationData from '../animation/settings-slider.json'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../hooks'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import MyOrders from '../features/limit-orders/MyOrders'

interface ExchangeHeaderProps {
  input?: Currency
  output?: Currency
  allowedSlippage?: Percent
}

const ExchangeHeader: FC<ExchangeHeaderProps> = ({ input, output, allowedSlippage }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const [animateSettings, setAnimateSettings] = useState(false)
  const [animateWallet, setAnimateWallet] = useState(false)
  const isRemove = router.asPath.startsWith('/remove')
  const isLimitOrder = router.asPath.startsWith('/limit-order')

  return (
    <div className="flex justify-between mb-4 space-x-3 items-center">
      <div className="grid grid-cols-3 rounded p-3px bg-dark-800 h-[46px]">
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink"
          as="/swap"
          href={`/swap?inputCurrency=${
            input && input.wrapped.address ? input.wrapped.address : WNATIVE[chainId].address
          }${output && output.wrapped.address ? `&outputCurrency=${output.wrapped.address}` : ''}`}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`Swap`)}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink"
          as="/limit-order"
          href={`/limit-order?inputCurrency=${
            input && input.wrapped.address ? input.wrapped.address : WNATIVE[chainId].address
          }${output && output.wrapped.address ? `&outputCurrency=${output.wrapped.address}` : ''}`}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`Limit`)}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink"
          href={`/${!isRemove ? 'add' : 'remove'}${input ? `/${currencyId(input)}` : ''}${
            output ? `/${currencyId(output)}` : ''
          }`}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`Liquidity`)}
          </a>
        </NavLink>
      </div>
      <div className="flex items-center">
        <div className="grid grid-flow-col gap-1">
          {isLimitOrder && (
            <div className="hidden md:flex items-center h-full w-full cursor-pointer hover:bg-dark-800 rounded px-3 py-1.5">
              <MyOrders />
            </div>
          )}
          {chainId === ChainId.MAINNET && (
            <div className=" text-green text-opacity-80 hover:text-opacity-100 hidden md:flex space-x-3 items-center hover:bg-dark-800 rounded h-full w-full px-3 cursor-pointer">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.5215 0.618164L12.6818 1.57302L15.933 4.37393V13.2435C15.9114 13.6891 15.5239 14.0498 15.0502 14.0286C14.6196 14.0074 14.2751 13.6679 14.2536 13.2435V7.28093C14.2536 6.21998 13.3923 5.37122 12.3158 5.37122H11.8421V2.67641C11.8421 1.61546 10.9808 0.766697 9.90428 0.766697H1.93779C0.861242 0.766697 0 1.61546 0 2.67641V18.4421C0 18.9089 0.387559 19.2909 0.861242 19.2909H10.9808C11.4545 19.2909 11.8421 18.9089 11.8421 18.4421V6.64436H12.3158C12.6818 6.64436 12.9617 6.92021 12.9617 7.28093V13.2435C13.0048 14.4105 13.9737 15.3017 15.1579 15.2805C16.2775 15.2381 17.1818 14.3469 17.2248 13.2435V3.80102L13.5215 0.618164ZM9.66744 8.89358H2.17464V3.10079H9.66744V8.89358Z"
                  fill="#7CFF6B"
                />
              </svg>

              <div className="hidden md:block  text-baseline">
                <Gas />
              </div>
            </div>
          )}
          <div className="relative w-full h-full rounded hover:bg-dark-800">
            <Settings placeholderSlippage={allowedSlippage} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExchangeHeader
