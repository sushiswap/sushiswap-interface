import { i18n } from '@lingui/core'
import classNames from 'classnames'
import { BigNumber } from 'ethers'
import numeral from 'numeral'

import { KashiPair } from '../types/KashiPair'

const PairCard = ({ containerClass = '', data }: { containerClass?: string; data?: KashiPair }) => {
  return (
    <div
      className={classNames({
        [containerClass]: true,
        'bg-dark-900 border border-dark-800 rounded shadow-md': true,
      })}
    >
      <div className="px-8 py-5 font-semibold border-b border-dark-700">{i18n._('Info')}</div>
      <div className="grid grid-cols-1 gap-4 px-8 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="w-full">
          <div className="font-medium">{i18n._('Supply')}</div>
          {!data ? (
            <div className="inline-block rounded loading h-7 w-36"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(
                BigNumber.from(data?.totalAsset).add(BigNumber.from(data.totalBorrow)).toNumber() / 100.0
              ).format('($0,0.00)')}
            </div>
          )}
        </div>
        <div className="">
          <div className="font-medium">{i18n._('Utilization')}</div>
          {!data ? (
            <div className="inline-block w-24 rounded loading h-7"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(
                BigNumber.from(data?.utilization).div(BigNumber.from('100000000000000')).toNumber() / 10000.0
              ).format('(0,0.00%)')}
            </div>
          )}
        </div>
        <div className="">
          <div className="font-medium">{i18n._('Available')}</div>
          {!data ? (
            <div className="inline-block rounded loading h-7 w-36"></div>
          ) : (
            <div className="text-2xl font-medium">{numeral(Number(data?.totalAsset) / 100.0).format('($0,0.00)')}</div>
          )}
        </div>
        <div className="">
          <div className="font-medium">{i18n._('Borrow')}&nbsp;</div>
          {!data ? (
            <div className="inline-block rounded loading h-7 w-36"></div>
          ) : (
            <div className="text-2xl font-medium">{numeral(Number(data?.totalBorrow) / 100.0).format('($0,0.00)')}</div>
          )}
        </div>
        <div className="">
          <div className="font-medium">{i18n._('Supply APY')}</div>
          {!data ? (
            <div className="inline-block w-20 rounded loading h-7"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(BigNumber.from(data?.supplyAPR).div(BigNumber.from('1000000000000')).toNumber() / 100000).format(
                '%0.00'
              )}
            </div>
          )}
        </div>
        <div className="">
          <div className="font-medium">{i18n._('Borrow APY')}</div>
          {!data ? (
            <div className="inline-block w-20 h-6 rounded loading"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(BigNumber.from(data?.borrowAPR).div(BigNumber.from('1000000000000')).toNumber() / 100000).format(
                '%0.00'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PairCard
