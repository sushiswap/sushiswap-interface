import { PoolType } from '@sushiswap/tines'
import Typography from 'app/components/Typography'
import { poolTypeNameMapper } from 'app/features/trident/types'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

import ClassicIcon from '/public/images/trident/pools/classic.svg'
import ConcentratedIcon from '/public/images/trident/pools/concentrated.svg'
import IndexIcon from '/public/images/trident/pools/index.svg'
import StableIcon from '/public/images/trident/pools/stable.svg'

import Image from '../../../components/Image'

const PoolTypeToIconMapper: Record<PoolType, StaticImageData> = {
  ConstantProduct: ClassicIcon,
  ConcentratedLiquidity: ConcentratedIcon,
  Hybrid: StableIcon,
  Weighted: IndexIcon,
}

interface PoolSelectorProps {
  type: PoolType
  selectedPool: PoolType
  comingSoon?: boolean
}

export const PoolSelector: FC<PoolSelectorProps> = ({ type, selectedPool, comingSoon }) => {
  const active = selectedPool === type

  return (
    <div
      id={`pool-select-${type}`}
      style={active ? { boxShadow: '#27b0e6 0px 7px 67px -33px' } : {}}
      className={classNames(
        'flex flex-col rounded justify-center border p-6 border-dark-700 overflow-hidden',
        active ? 'text-high-emphesis' : 'text-secondary',
        comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      <Typography variant="h3" weight={700} className="truncate">
        {poolTypeNameMapper[type]}
      </Typography>
      <div className={classNames('flex text-sm mt-2', comingSoon ? 'justify-between' : 'justify-end')}>
        {comingSoon && <span>COMING SOON</span>}
        <div className={classNames('-m-6', comingSoon && 'opacity-50')}>
          <Image
            src={PoolTypeToIconMapper[type]}
            alt={`${type} icon`}
            width="100px"
            height="100px"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  )
}
