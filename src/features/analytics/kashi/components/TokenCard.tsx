import { i18n } from '@lingui/core'
import classNames from 'classnames'
import { BigNumber } from 'ethers'
import numeral from 'numeral'

import { Token } from '../types/Token'

const TokenCard = ({
  containerClass = '',
  data,
  totalAsset = BigInt(0),
  totalBorrow = BigInt(0),
}: {
  containerClass?: string
  data?: Token
  totalAsset?: BigInt
  totalBorrow?: BigInt
}) => {
  return (
    <div
      className={classNames({
        [containerClass]: true,
        'bg-dark-900 border border-dark-800 rounded shadow-md': true,
      })}
    >
      <div className="px-8 py-5 font-semibold border-b border-dark-700">{i18n._('Info')}</div>
      <div className="grid grid-cols-1 gap-4 px-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-medium">{i18n._('Supply')}</div>
          {!data ? (
            <div className="inline-block rounded animate-pulse bg-dark-700 h-7 w-36"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(BigNumber.from(totalAsset).add(BigNumber.from(totalBorrow)).toNumber() / 100.0).format(
                '($0,0.00)'
              )}
            </div>
          )}
        </div>
        <div>
          <div className="font-medium">{i18n._('Available')}</div>
          {!data ? (
            <div className="inline-block rounded animate-pulse bg-dark-700 h-7 w-36"></div>
          ) : (
            <div className="text-2xl font-medium">{numeral(Number(totalAsset) / 100.0).format('($0,0.00)')}</div>
          )}
        </div>
        <div>
          <div className="font-medium">{i18n._('Borrow')}</div>
          {!data ? (
            <div className="inline-block rounded animate-pulse bg-dark-700 h-7 w-36"></div>
          ) : (
            <div className="text-2xl font-medium">{numeral(Number(totalBorrow) / 100.0).format('($0,0.00)')}</div>
          )}
        </div>
        <div>
          <div className="font-medium">{i18n._('Oracle Price')}</div>
          {!data ? (
            <div className="inline-block w-20 animate-pulse bg-dark-700 loading h-7"></div>
          ) : (
            <div className="text-2xl font-medium">
              {numeral(BigNumber.from(data.price).div(BigNumber.from(1e6)).toNumber() / 100).format('($0,0.00)')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TokenCard
