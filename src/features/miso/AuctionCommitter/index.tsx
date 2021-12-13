import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/core-sdk'
import CurrencyLogo from 'app/components/CurrencyLogo'
import NumericalInput from 'app/components/Input/Numeric'
import Typography from 'app/components/Typography'
import { Auction } from 'app/features/miso/context/Auction'
import MisoButton from 'app/features/miso/MisoButton'
import { tryParseAmount } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { FC, useState } from 'react'

import AuctionCommitterSkeleton from './AuctionCommitterSkeleton'

interface AuctionCommitterProps {
  auction?: Auction<Token, Token>
}

const AuctionCommitter: FC<AuctionCommitterProps> = ({ auction }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, auction?.paymentToken)
  const [value, setValue] = useState<string>()

  if (!auction) return <AuctionCommitterSkeleton />

  return (
    <div className="mt-6 relative">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <Typography weight={700} className="text-high-emphesis">
            {i18n._(t`Participate`)}
          </Typography>
          <Typography
            role="button"
            variant="sm"
            weight={700}
            className="text-low-emphesis"
            onClick={() => setValue(balance?.toExact())}
          >
            Balance: {balance?.toSignificant(6)} {balance?.currency.symbol}
          </Typography>
        </div>
        <div className="flex rounded bg-dark-900 px-4 py-2.5 gap-4 items-center">
          <CurrencyLogo currency={auction.paymentToken} size={42} className="rounded-full" />
          <div className="flex items-baseline gap-2 flex-grow">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {auction.paymentToken.symbol}
            </Typography>
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              <NumericalInput
                disabled={false}
                value={value || ''}
                onUserInput={(val) => setValue(val)}
                placeholder="0.00"
                className="bg-transparent text-inherit"
                autoFocus
              />
            </Typography>
          </div>
          <div
            role="button"
            onClick={() => setValue(balance?.toExact())}
            className="cursor-pointer flex flex-col items-center justify-center rounded-full overflow-hidden bg-gradient-to-r from-red/30 via-pink/30 to-red/30 bg-opacity-20 border border-red text-pink px-3 h-9"
          >
            <Typography>{i18n._(t`MAX`)}</Typography>
          </div>
        </div>
        <MisoButton amount={tryParseAmount(value, auction.paymentToken)} auction={auction} />
      </div>
    </div>
  )
}

export default AuctionCommitter
