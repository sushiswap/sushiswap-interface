import { Currency, Price } from '@sushiswap/sdk'
import { FC, useState } from 'react'
import { useDerivedLimitOrderInfo, useLimitOrderState } from '../../../state/limit-order/hooks'

import { Field } from '../../../state/limit-order/actions'

const PriceRatio: FC = () => {
  const { currencies, currentPrice, parsedAmounts } = useDerivedLimitOrderInfo()
  const [inverted, setInverted] = useState(false)

  const price =
    parsedAmounts[Field.INPUT] && parsedAmounts[Field.OUTPUT]
      ? new Price<Currency, Currency>({
          baseAmount: parsedAmounts[Field.INPUT],
          quoteAmount: parsedAmounts[Field.OUTPUT],
        })
      : currentPrice

  return (
    <div className="flex flex-row font-bold text-sm ">
      <div className="flex divide-x divide-dark-800 hover:divide-dark-700 cursor-pointer rounded border border-dark-800 hover:border-dark-700">
        <div className="py-2 px-4">
          <span className="whitespace-nowrap">
            1 {inverted ? currencies.OUTPUT?.symbol : currencies.INPUT?.symbol} ={' '}
            {inverted ? price?.invert().toSignificant(6) : price?.toSignificant(6)}{' '}
            {inverted ? currencies.INPUT?.symbol : currencies.OUTPUT?.symbol}
          </span>
        </div>
        <div
          className="py-2 w-9 flex items-center justify-center cursor-pointer text-secondary"
          onClick={() => setInverted((prevState) => !prevState)}
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.02785 4.15497C2.89623 4.2868 2.6816 4.2868 2.54999 4.15497L0.641292 2.24649C0.57538 2.18037 0.57538 2.07347 0.641292 2.00735L2.54999 0.0988676C2.6816 -0.0329559 2.89623 -0.0329559 3.02785 0.0988676L3.46493 0.535955C3.59676 0.667567 3.59676 0.882203 3.46493 1.01382L3.02785 1.4509H9.04208C10.3468 1.4509 11.4081 2.51225 11.4081 3.81697C11.4081 4.09646 11.1806 4.32398 10.9011 4.32398H10.5631C10.2836 4.32398 10.0561 4.09646 10.0561 3.81697C10.0561 3.25777 9.60127 2.80294 9.04208 2.80294H3.02785L3.46493 3.24003C3.59676 3.37164 3.59676 3.58627 3.46493 3.71789L3.02785 4.15497ZM8.97215 5.84502C9.10398 5.71319 9.3184 5.71319 9.45001 5.84502L11.3587 7.7535C11.4246 7.81962 11.4246 7.92652 11.3587 7.99264L9.45001 9.90112C9.31819 10.0329 9.104 10.033 8.97215 9.90112L8.53507 9.46404C8.40278 9.33175 8.40299 9.11825 8.53507 8.98618L8.97215 8.54909H2.95792C1.65321 8.54909 0.591858 7.48774 0.591858 6.18303C0.591858 5.90354 0.81938 5.67601 1.09887 5.67601H1.43688C1.71637 5.67601 1.94389 5.90354 1.94389 6.18303C1.94389 6.74222 2.39873 7.19705 2.95792 7.19705H8.97215L8.53507 6.75997C8.40278 6.62768 8.40299 6.41418 8.53507 6.28211L8.97215 5.84502Z"
              fill="#BFBFBF"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default PriceRatio
