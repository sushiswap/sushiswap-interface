import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from '@sushiswap/core-sdk'
import AuctionAdminFormTextField from 'app/features/miso/AuctionAdminForm/AuctionAdminFormTextField'
import { isAddressValidator, pipeline } from 'app/features/miso/AuctionAdminForm/validators'
import { Auction } from 'app/features/miso/context/Auction'
import { useAuctionPointListPoints } from 'app/features/miso/context/hooks/useAuctionPointList'
import { classNames, isAddress } from 'app/functions'
import React, { FC, Fragment, useState } from 'react'

interface WhitelistCheckerProps {
  auction: Auction
}

const WhitelistChecker: FC<WhitelistCheckerProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const [error, setError] = useState<string>()
  const [address, setAddress] = useState<string>()
  const valid = isAddress(address)
  const points = useAuctionPointListPoints(
    auction.whitelist?.[0],
    !error && valid ? valid : undefined,
    auction.paymentToken
  )

  const whitelisted = address && !error && points && points.greaterThan(ZERO)
  const nonWhitelisted = address && !error && !points

  return (
    <>
      <div className={classNames('flex col-span-6 gap-4')}>
        <div className="flex flex-col flex-grow">
          <AuctionAdminFormTextField
            error={error}
            label={i18n._(t`Whitelist Checker`)}
            onChange={(e) =>
              pipeline({ value: e.target.value }, [isAddressValidator], () => setAddress(e.target.value), setError)
            }
            placeholder="0x..."
            value={address}
            helperText={
              <p
                className={classNames(
                  'mt-2 text-sm',
                  whitelisted ? 'text-green' : nonWhitelisted ? 'text-red' : 'text-gray-500'
                )}
              >
                {whitelisted
                  ? i18n._(t`Address is whitelisted!`)
                  : nonWhitelisted
                  ? i18n._(t`Address is not whitelisted!`)
                  : i18n._(t`Check if an address is whitelisted`)}
              </p>
            }
          />
        </div>
      </div>
    </>
  )
}

export default WhitelistChecker
