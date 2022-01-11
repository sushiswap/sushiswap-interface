import Typography from 'app/components/Typography'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'

import { POOL_TYPES } from '../constants'

interface PoolTypesListProps {}

const PoolTypesList: FC<PoolTypesListProps> = () => {
  return (
    <div className="flex flex-col gap-4 px-5 cursor-pointer">
      {Object.entries(POOL_TYPES).map(([k, poolType], index) => (
        <Link passHref href={`/trident/pooltypes/${k.toLowerCase()}`} key={index}>
          <div
            className="rounded relative bg-dark-800 overflow-hidden pt-[10px] flex items-end bg-gradient-to-r from-transparent-blue to-transparent-pink"
            key={poolType.label}
          >
            <div className="absolute bg-x-times-y-is-k w-full h-full bg-cover opacity-[0.02]" />
            <div className="flex flex-row justify-between flex-grow gap-1">
              <div className="flex flex-row">
                <div className="p-5 ">
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    {poolType.label_long}
                  </Typography>
                  <Typography variant="xs">{poolType.description}</Typography>
                </div>
              </div>
              <div className="relative flex justify-end" style={{ minHeight: poolType.image.height }}>
                <div className="block" style={{ minHeight: poolType.image.height, minWidth: poolType.image.width }}>
                  <Image
                    src={poolType.image.url}
                    width={poolType.image.width}
                    height={poolType.image.height}
                    alt="weighted scale"
                    layout="responsive"
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PoolTypesList
