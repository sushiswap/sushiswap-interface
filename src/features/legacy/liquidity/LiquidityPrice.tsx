// TODO / Note (amiller68): #SdkChange / #SdkPublish
import { Currency, Percent, Price } from '@figswap/core-sdk'
import Typography from 'app/components/Typography'
import { ONE_BIPS } from 'app/constants'
import TradePrice from 'app/features/legacy/swap/TradePrice'
import { classNames } from 'app/functions'
import { Field } from 'app/state/mint/actions'
import React, { FC, useState } from 'react'

interface LiquidityPriceProps {
  currencies: { [field in Field]?: Currency }
  price?: Price<Currency, Currency>
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  className?: string
}

const LiquidityPrice: FC<LiquidityPriceProps> = ({
  currencies,
  price,
  noLiquidity,
  poolTokenPercentage,
  className,
}) => {
  const [inverted, setInverted] = useState(false)
  // bottom half of add
  return (
    <div className="flex flex-col items-center">
      <div
        className={classNames(
          'flex flex-col gap-2 px-3 py-2 rounded-md border border-2 border-[#292929] bg-[#1A1A1A] w-11/12',
          className
        )}
      >
        <div className="flex justify-between gap-4">
          <Typography variant="sm" className="font-medium">
            RATE
          </Typography>
          <div>
            <TradePrice
              inputCurrency={currencies[Field.CURRENCY_A]}
              outputCurrency={currencies[Field.CURRENCY_B]}
              price={price}
              showInverted={inverted}
              setShowInverted={setInverted}
            />
          </div>
        </div>
        <div className="font-mono flex justify-between gap-4">
          <Typography variant="sm" className="font-medium">
            SHARE OF POOL
          </Typography>
          <Typography variant="sm" className="text-right text-white">
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default LiquidityPrice
