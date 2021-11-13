import { PlusIcon } from '@heroicons/react/solid'
import AssetSelect from 'app/components/AssetSelect'
import Typography from 'app/components/Typography'
import { useIndependentAssetInputs } from 'app/features/trident/context/hooks/useIndependentAssetInputs'
import React, { FC, useCallback } from 'react'

export const SelectAssetsWidget: FC = () => {
  const {
    currencies: [currencies, setCurrencies],
  } = useIndependentAssetInputs()

  const handleSelectedPoolTokens = useCallback(
    (currency, index) => {
      const copy = [...currencies]
      copy[index] = currency
      setCurrencies(copy)
    },
    [currencies, setCurrencies]
  )

  return (
    <div>
      <Typography variant="h3" weight={700} className="text-high-emphesis">
        Select Two Assets
      </Typography>
      <div className="text-secondary mt-2">Please select the two assets that this pool will consist of.</div>
      <div className="flex flex-col gap-2 max-w-2xl">
        <div className="relative">
          <AssetSelect
            value={currencies[0]}
            onSelect={(cur) => handleSelectedPoolTokens(cur, 0)}
            header={
              <Typography variant="xs" className="text-secondary tracking-[2.04px] mb-2 ml-4" weight={700}>
                POOL TOKEN A
              </Typography>
            }
          />
          <div className="absolute top-24 right-2 z-0">
            <div className="border-[3px] border-dark-900 bg-dark-800 rounded-full w-[64px] h-[64px] flex items-center justify-center text-high-emphesis">
              <PlusIcon width={46} height={46} />
            </div>
          </div>
        </div>
        <AssetSelect
          value={currencies[1]}
          onSelect={(cur) => handleSelectedPoolTokens(cur, 1)}
          header={
            <Typography variant="xs" className="text-secondary tracking-[2.04px] mb-2 ml-4" weight={700}>
              POOL TOKEN B
            </Typography>
          }
        />
      </div>
    </div>
  )
}
