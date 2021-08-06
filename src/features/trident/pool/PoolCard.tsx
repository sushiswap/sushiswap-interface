import React, { FC } from 'react'
import { SUSHI, USDC, XSUSHI } from '../../../constants'
import { ChainId, WETH9 } from '@sushiswap/sdk'
import Chip from '../../../components/Chip'
import Typography from '../../../components/Typography'
import { CurrencyLogoArray } from '../../../components/CurrencyLogo'
import Link from 'next/link'

interface PoolCardProps {}

const PoolCard: FC<PoolCardProps> = () => {
  return (
    <Link href="/trident/pool/1">
      <div className="rounded border border-dark-700 bg-dark-900 overflow-hidden">
        <div className="flex justify-between p-3 items-center">
          <div className="flex gap-2 items-center">
            <CurrencyLogoArray
              currencies={[SUSHI[ChainId.MAINNET], WETH9[ChainId.MAINNET], USDC, XSUSHI]}
              size={30}
              dense
              maxLogos={4}
            />
            <Chip label="Classic" />
          </div>
          <div className="flex gap-1.5 items-baseline">
            <Typography className="text-secondary" variant="sm" weight={400}>
              APY
            </Typography>
            <Typography className="text-high-emphesis leading-5" variant="lg" weight={700}>
              37.8%
            </Typography>
          </div>
        </div>
        <div className="flex justify-between items-center bg-dark-800 px-3 pt-2.5 pb-1.5">
          <div className="flex flex-col">
            <Typography className="text-high-emphesis leading-5" variant="lg" weight={400}>
              SUSHI-WETH
            </Typography>
            <Typography className="text-blue leading-5" variant="xs" weight={700}>
              0.3% Fees
            </Typography>
          </div>
          <div className="flex gap-1">
            <Typography className="text-secondary" variant="xs" weight={700}>
              TVL:
            </Typography>
            <Typography className="text-high-emphesis" variant="xs" weight={700}>
              $1,504,320
            </Typography>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PoolCard
