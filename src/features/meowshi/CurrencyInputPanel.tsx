import { Field, MeowshiState } from '../../pages/tools/meowshi'
import React, { FC } from 'react'
import { SUSHI, XSUSHI } from '../../config/tokens'

import { ChainId } from '@sushiswap/sdk'
import Image from 'next/image'
import Input from '../../components/Input'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions'
import { useActiveWeb3React } from '../../hooks'
import { useLingui } from '@lingui/react'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useUSDCValue } from '../../hooks/useUSDCPrice'

interface CurrencyInputPanelProps {
  field: Field
  meowshiState: MeowshiState
  showMax: boolean
}

const CurrencyInputPanel: FC<CurrencyInputPanelProps> = ({ field, meowshiState, showMax }) => {
  const { currencies, handleInput, setCurrency, fields } = meowshiState

  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const currency = currencies[field]
  const balance = useTokenBalance(account, currency)
  const inputUSDCValue = useUSDCValue(tryParseAmount(fields[field], currencies[field]))
  const balanceUSDCValue = useUSDCValue(balance)

  return (
    <>
      <div className="rounded bg-dark-800">
        <div className="flex flex-col justify-between p-5 space-y-3 sm:space-y-0 sm:flex-row">
          <div className="flex items-center w-full sm:w-2/5">
            <div className="flex items-center gap-4">
              <Image
                src={
                  currency === SUSHI[ChainId.MAINNET]
                    ? '/images/tokens/sushi-square.jpg'
                    : currency === XSUSHI
                    ? '/images/tokens/xsushi-square.jpg'
                    : '/images/tokens/nyan-square.jpg'
                }
                alt="SUSHI"
                width="62px"
                height="62px"
                objectFit="contain"
                className="rounded-full"
              />
              <div className="flex flex-col items-start">
                <Typography variant="h3" className="leading-6 text-high-emphesis" weight={700}>
                  {currency?.symbol}
                </Typography>
                {(currency === SUSHI[ChainId.MAINNET] || currency === XSUSHI) && (
                  <Typography
                    variant="xs"
                    className="underline cursor-pointer text-blue"
                    onClick={() => setCurrency(currency === XSUSHI ? SUSHI[ChainId.MAINNET] : XSUSHI, field)}
                  >
                    {currencies[field] === SUSHI[ChainId.MAINNET] ? i18n._(t`Use xSUSHI`) : i18n._(t`Use SUSHI`)}
                  </Typography>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full px-3 py-2 rounded bg-dark-900 sm:w-3/5">
            <div className="flex flex-col items-start">
              <div className="w-full">
                <Input.Numeric
                  className="w-full text-2xl leading-4 bg-transparent"
                  id="token-amount-input"
                  value={fields[field]}
                  onUserInput={(val) => handleInput(val, field)}
                />
              </div>
              {inputUSDCValue && (
                <div className="text-xs font-medium text-low-emphesis">
                  ≈ {inputUSDCValue?.toSignificant(6, { groupSeparator: ',' })} USDC
                </div>
              )}
            </div>

            {showMax && (
              <span
                onClick={() => handleInput(balance?.toExact(), field)}
                className="flex items-center justify-center px-2 py-1 text-sm uppercase border border-opacity-50 cursor-pointer border-blue bg-blue text-blue bg-opacity-30 rounded-3xl hover:border-opacity-100"
              >
                {i18n._(t`Max`)}
              </span>
            )}
          </div>
        </div>
        <div className="bg-dark-700 rounded-b flex justify-end px-5 py-1.5 gap-2">
          <Typography
            variant="xs"
            component="span"
            onClick={() => handleInput(balance?.toExact(), field)}
            className="cursor-pointer text-primary"
          >
            Balance: {balance?.toSignificant(6, { groupSeparator: ',' }) || '0'} {currency?.symbol}
          </Typography>
          {balanceUSDCValue && (
            <>
              <Typography variant="xs" component="span" className="text-pr]">
                {' ≈ '}
              </Typography>
              <Typography variant="xs" component="span" className="text-secondary">
                ${balanceUSDCValue?.toSignificant(6, { groupSeparator: ',' })} USDC
              </Typography>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CurrencyInputPanel
