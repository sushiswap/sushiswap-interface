import { FC } from 'react'
import Link from 'next/link'
import Typography from '../../../components/Typography'
import { POOL_TYPES } from '../constants'

interface PoolTypesListProps {}

const PoolTypesList: FC<PoolTypesListProps> = () => {
  return (
    <div className="px-5 flex flex-col gap-4 cursor-pointer">
      {Object.values(POOL_TYPES).map((poolType, index) => (
        <Link href={`/trident/pool/types/${index}`} key={index}>
          <div className="rounded relative bg-dark-800 overflow-hidden" key={poolType.label}>
            <div className="absolute bg-x-times-y-is-k w-full h-full bg-cover opacity-[0.02]" />
            <div className="p-5 bg-gradient-to-r from-transparent-blue to-transparent-pink">
              <Typography variant="lg" weight={700} className="text-high-emphesis">
                {poolType.label}
              </Typography>
              <Typography variant="xs">{poolType.description}</Typography>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PoolTypesList
