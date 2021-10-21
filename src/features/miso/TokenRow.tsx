import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import Typography from '../../components/Typography'
import { DuplicateIcon, ArrowSmRightIcon } from '@heroicons/react/outline'
import { classNames, e10, shortenAddress } from '../../functions'
import Image from 'next/image'
import { formatRemainingTime } from './helper/formatRemainingTime'
import { useEffect, useState } from 'react'
import { useCurrency } from '../../hooks/Tokens'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useAuctionInfo } from '../../hooks/miso/useAuctionInfo'
import LendWithdrawAction from '../kashi/Withdraw'
import { formatUnits } from '@ethersproject/units'

import { clearingPrice, tokenPrice } from './helper/dutch'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { useUSDCPrice } from '../../hooks'
import NavLink from '../../components/NavLink'

export default function TokenRow({ token }: any) {
  const { i18n } = useLingui()

  const currency = useCurrency(token.address)
  const [tokenDetails, setTokenDetails] = useState({
    price: '4.56',
    priceChange: '2.37',
    marketCap: '368,957,566,282',
    marketCapChange: '2.35',
    volume24h: '35,402,468,110',
    volume24hChange: '2.35',
    totalSupply: '117,241,234,990',
    circulatingSupply: '17,213,534,782',
  })

  useEffect(() => {}, [])

  return !token ? (
    <div></div>
  ) : (
    <div className="my-3 cursor-pointer">
      <NavLink href="#">
        <div className="grid grid-cols-6 auto-cols-min">
          <div className="flex items-center space-x-2">
            <CurrencyLogo currency={currency} size={'40px'} />
            <div className="flex flex-col">
              <Typography variant="base" className=" text-primary">
                {i18n._(`${token.symbol}`)}
              </Typography>
              <Typography variant="sm" className=" text-secondary">
                {i18n._(`${token.name}`)}
              </Typography>
            </div>
          </div>

          <div className="flex flex-col">
            <Typography variant="base" className="text-primary">
              {i18n._(`$${tokenDetails.price}`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(`${tokenDetails.priceChange}%`)}
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography variant="base" className="text-primary">
              {i18n._(`$${tokenDetails.marketCap}`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(`${tokenDetails.marketCapChange}%`)}
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography variant="base" className="text-primary">
              {i18n._(`$${tokenDetails.volume24h}`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(`${tokenDetails.volume24hChange}%`)}
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography variant="base" className="text-primary">
              {i18n._(`${tokenDetails.totalSupply} ${token.symbol}`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(t``)}
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography variant="base" className="text-primary">
              {i18n._(`${tokenDetails.circulatingSupply} ${token.symbol}`)}
            </Typography>
            <Typography variant="sm" className="text-secondary">
              {i18n._(t``)}
            </Typography>
          </div>
        </div>
      </NavLink>
    </div>
  )
}
