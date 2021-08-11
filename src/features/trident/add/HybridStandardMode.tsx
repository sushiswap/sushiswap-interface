import React, { FC, useCallback, useMemo, useState } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { plural, t } from '@lingui/macro'
import { useTokenBalances } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import CurrencyLogo from '../../../components/CurrencyLogo'
import { useTridentAddLiquidityPageContext, useTridentAddLiquidityPageState } from './context'
import { Currency, Token } from '@sushiswap/sdk'
import { classNames } from '../../../functions'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Disclosure } from '@headlessui/react'
import AssetInput from '../../../components/AssetInput'
import DepositButtons from './DepositButtons'
import { ActionType } from './context/types'

function toggleArrayItem(arr, item) {
  return arr.includes(item)
    ? arr.filter((i) => i !== item) // remove item
    : [...arr, item] // add item
}

const TokenTile = ({
  token,
  onClick = null,
  active = false,
  vertical = false,
}: {
  token: Token
  onClick?: () => void
  active?: boolean
  vertical?: boolean
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        onClick ? 'cursor-pointer' : '',
        vertical ? 'flex-row p-2' : 'flex-col p-3',
        active ? 'opacity-100' : 'opacity-50',
        'flex border border-dark-700 bg-dark-900 rounded items-center justify-center gap-2'
      )}
    >
      <div className="rounded-full overflow-hidden">
        <div>
          <CurrencyLogo currency={token} size={vertical ? 26 : 38} />
        </div>
      </div>
      <Typography variant="lg" className="text-high-emphesis">
        {token.symbol}
      </Typography>
    </div>
  )
}

const HybridStandardMode: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { inputAmounts } = useTridentAddLiquidityPageState()
  const { pool, handleInput, dispatch } = useTridentAddLiquidityPageContext()
  const [selected, setSelected] = useState<Token[]>([])
  const balances = useTokenBalances(account, pool.tokens)

  const availableAssets = useMemo(
    () =>
      Object.values(balances)
        .sort((a, b) => (a.lessThan(b.quotient) ? -1 : 1))
        .filter((el) => el.greaterThan('0')),
    [balances]
  )

  const unavailableAssets = useMemo(
    () => pool.tokens.filter((token) => !availableAssets.some((balance) => balance.currency === token)),
    [pool.tokens, availableAssets]
  )

  const onMax = useCallback(() => {
    dispatch({
      type: ActionType.SET_INPUT_AMOUNTS,
      payload: availableAssets.reduce((acc, cur) => {
        if (selected.includes(cur.currency))
          acc.push({
            amount: cur.toExact(),
            address: cur.currency.address,
          })

        return acc
      }, []),
    })
  }, [availableAssets, dispatch, selected])

  const isMaxInput = useMemo(() => {
    return selected.every((el) => inputAmounts[el.address] === balances[el.address]?.toExact())
  }, [balances, inputAmounts, selected])

  return (
    <div className="flex flex-col mt-8 px-5 gap-8">
      <div className="flex flex-col">
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex flex-row justify-between">
                <Typography variant="lg" weight={700} className={open ? 'text-high-emphesis' : 'text-secondary'}>
                  {i18n._(t`Available Assets`)}
                </Typography>
                <div className="flex gap-0.5">
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    <span className="text-blue">{availableAssets.length}</span>/{pool.tokens.length}
                  </Typography>
                  <ChevronDownIcon className={open ? 'transform rotate-180' : ''} width={24} height={24} />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                <Typography variant="sm" className="text-high-emphesis mt-3">
                  {i18n._(t`You have balances of each of the following assets, ordered from greatest to least amount. Tap to toggle which
        ones you would like to deposit`)}
                </Typography>
                <div className="grid grid-cols-4 mt-6 gap-4">
                  {availableAssets.map((balance, index) => (
                    <TokenTile
                      token={balance.currency}
                      key={index}
                      active={selected.includes(balance.currency)}
                      onClick={() => setSelected((prevState) => toggleArrayItem(prevState, balance.currency))}
                    />
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      <div className="flex flex-col">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex flex-row justify-between">
                <Typography variant="lg" weight={700} className={open ? 'text-high-emphesis' : 'text-secondary'}>
                  {i18n._(t`Unavailable Assets`)}
                </Typography>
                <div className="flex gap-0.5">
                  <Typography variant="lg" weight={700} className="text-high-emphesis">
                    <span className="text-secondary">{unavailableAssets.length}</span>/{pool.tokens.length}
                  </Typography>
                  <ChevronDownIcon className={open ? 'transform rotate-180' : ''} width={24} height={24} />
                </div>
              </Disclosure.Button>
              <Disclosure.Panel>
                <Typography variant="sm" className="text-high-emphesis mt-3">
                  {i18n._(t`You have no balances of the following assets.`)}
                </Typography>
                <div className="flex flex-row mt-6 gap-4">
                  {unavailableAssets.map((token, index) => (
                    <TokenTile token={token} key={index} vertical />
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      {selected.length > 0 && (
        <>
          <div className="flex flex-col">
            <Typography variant="h3" weight={700} className="text-high-emphesis">
              Enter Amounts
            </Typography>
            <Typography variant="xs" className="text-blue">
              {i18n._(t`${selected.length} ${plural(selected.length, { one: 'Asset', other: 'Assets' })} Selected`)}
            </Typography>
          </div>
          <div className="flex flex-col gap-6">
            {selected.map((currency) => (
              <AssetInput
                key={currency.address}
                currency={currency}
                value={inputAmounts[currency.address]}
                onChange={(val) => handleInput(val, currency.address)}
              />
            ))}

            <DepositButtons
              onMax={onMax}
              isMaxInput={isMaxInput}
              inputValid={Object.values(inputAmounts).some((el) => +el > 0)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default HybridStandardMode
