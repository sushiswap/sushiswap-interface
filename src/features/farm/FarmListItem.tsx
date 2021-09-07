import { classNames, formatNumber, formatPercent } from '../../functions'

import { Disclosure } from '@headlessui/react'
import DoubleLogo from '../../components/DoubleLogo'
import FarmListItemDetails from './FarmListItemDetails'
import Image from '../../components/Image'
import { PairType } from './enum'
import QuestionHelper from '../../components/QuestionHelper'
import React from 'react'
import { useCurrency } from '../../hooks/Tokens'

const FarmListItem = ({ farm, ...rest }) => {
  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1.id)

  return (
    <Disclosure {...rest}>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={classNames(
              open && 'rounded-b-none',
              'w-full px-4 py-6 text-left rounded cursor-pointer select-none bg-dark-900 text-primary text-sm md:text-lg'
            )}
          >
            <div className="grid grid-cols-4">
              <div className="flex col-span-2 space-x-4 md:col-span-1">
                <DoubleLogo currency0={token0} currency1={token1} size={40} />
                <div className="flex flex-col justify-center">
                  <div>
                    <span className="font-bold">{farm?.pair?.token0?.symbol}</span>/
                    <span className={farm?.pair?.type === PairType.KASHI ? 'font-thin' : 'font-bold'}>
                      {farm?.pair?.token1?.symbol}
                    </span>
                  </div>
                  {farm?.pair?.type === PairType.SWAP && (
                    <div className="text-xs md:text-base text-secondary">SushiSwap Farm</div>
                  )}
                  {farm?.pair?.type === PairType.KASHI && (
                    <div className="text-xs md:text-base text-secondary">Kashi Farm</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center font-bold">{formatNumber(farm.tvl, true)}</div>
              <div className="flex-row items-center hidden space-x-4 md:flex">
                <div className="flex items-center space-x-2">
                  {farm?.rewards?.map((reward, i) => (
                    <div key={i} className="flex items-center">
                      <Image
                        src={reward.icon}
                        width="30px"
                        height="30px"
                        className="rounded-md"
                        layout="fixed"
                        alt={reward.token}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col space-y-1">
                  {farm?.rewards?.map((reward, i) => (
                    <div key={i} className="text-xs md:text-sm whitespace-nowrap">
                      {formatNumber(reward.rewardPerDay)} {reward.token} / DAY
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <div className="flex flex-row items-center font-bold text-right text-high-emphesis">
                  {farm?.tvl !== 0
                    ? farm?.roiPerYear > 10000
                      ? '>10,000%'
                      : formatPercent(farm?.roiPerYear * 100)
                    : 'Infinite'}
                  {!!farm?.feeApyPerYear && (
                    <QuestionHelper
                      text={
                        <div className="flex flex-col">
                          <div>
                            Reward APR:{' '}
                            {farm?.tvl !== 0
                              ? farm?.rewardAprPerYear > 10000
                                ? '>10,000%'
                                : formatPercent(farm?.rewardAprPerYear * 100)
                              : 'Infinite'}
                          </div>
                          <div>
                            Fee APR:{' '}
                            {farm?.feeApyPerYear < 10000 ? formatPercent(farm?.feeApyPerYear * 100) : '>10,000%'}
                          </div>
                        </div>
                      }
                    />
                  )}
                </div>
                <div className="text-xs text-right md:text-base text-secondary">annualized</div>
              </div>
            </div>
          </Disclosure.Button>
          {open && <FarmListItemDetails farm={farm} />}
        </div>
      )}
    </Disclosure>
  )
}

export default FarmListItem
