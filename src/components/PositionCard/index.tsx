import { Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, JSBI, Pair, Percent, Token } from '@sushiswap/core-sdk'
import { BIG_INT_ZERO } from 'app/constants'
import { classNames } from 'app/functions'
import { currencyId, unwrappedToken } from 'app/functions/currency'
import { useColor } from 'app/hooks/useColor'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Button from '../Button'
import { AutoColumn } from '../Column'
import { CurrencyLogo } from '../CurrencyLogo'
import Dots from '../Dots'
import DoubleCurrencyLogo from '../DoubleLogo'

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, JSBI.BigInt(0)) ? (
        <div className="p-5 rounded bg-dark-800 text-high-emphesis">
          <AutoColumn gap={'md'}>
            <div className="text-lg">Your Position</div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="flex items-center w-auto space-x-4">
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={40} />
                <div className="text-2xl font-semibold">
                  {currency0.symbol}/{currency1.symbol}
                </div>
              </div>
              <div className="flex items-center mt-3 space-x-2 text-base md:mt-0">
                <div>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'} </div>
                <div className="text-secondary">Pool Tokens</div>
              </div>
            </div>
            <div className="flex flex-col w-full p-3 mt-3 space-y-1 text-sm rounded bg-dark-900 text-high-emphesis">
              <div className="flex justify-between">
                <div>{i18n._(t`Your pool share`)}</div>
                <div className="font-bold">{poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}</div>
              </div>
              <div className="flex justify-between">
                <div>{currency0.symbol}:</div>
                {token0Deposited ? (
                  <div className="flex space-x-2 font-bold">
                    <div> {token0Deposited?.toSignificant(6)}</div>
                    <div className="text-secondary">{currency0.symbol}</div>
                  </div>
                ) : (
                  '-'
                )}
              </div>
              <div className="flex justify-between">
                <div>{currency1.symbol}:</div>
                {token1Deposited ? (
                  <div className="flex space-x-2 font-bold">
                    <div>{token1Deposited?.toSignificant(6)}</div>
                    <div className="text-secondary">{currency1.symbol}</div>
                  </div>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </AutoColumn>
        </div>
      ) : null}
    </>
  )
}

export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
  const { i18n } = useLingui()
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)

  return (
    <div
      className="rounded bg-dark-800"
      // style={{ backgroundColor }}
    >
      <Button
        variant="empty"
        className={classNames(
          'flex items-center justify-between w-full px-4 py-6 cursor-pointer bg-dark-800 hover:bg-dark-700 !text-blue',
          showMore && '!bg-dark-800'
        )}
        style={{ boxShadow: 'none' }}
        onClick={() => setShowMore(!showMore)}
      >
        <div className="flex items-center space-x-4">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={40} />
          <div className="text-xl font-semibold">
            {!currency0 || !currency1 ? <Dots>{i18n._(t`Loading`)}</Dots> : `${currency0.symbol}/${currency1.symbol}`}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {i18n._(t`Manage`)}
          {showMore ? (
            <ChevronUpIcon width="20px" height="20px" className="ml-4" />
          ) : (
            <ChevronDownIcon width="20px" height="20px" className="ml-4" />
          )}
        </div>
      </Button>

      <Transition
        show={showMore}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="p-4 space-y-4">
          <div className="px-4 py-4 space-y-1 text-sm rounded text-high-emphesis bg-dark-900">
            <div className="flex items-center justify-between">
              <div>{i18n._(t`Your total pool tokens`)}:</div>
              <div className="font-semibold">{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</div>
            </div>
            {/* {stakedBalance && (
              <div className="flex items-center justify-between">
                <div>{i18n._(t`Pool tokens in rewards pool`)}:</div>
                <div className="font-semibold">{stakedBalance.toSignificant(4)}</div>
              </div>
            )} */}
            <div className="flex items-center justify-between">
              <div>{i18n._(t`Pooled ${currency0?.symbol}`)}:</div>
              {token0Deposited ? (
                <div className="flex items-center space-x-2">
                  <div className="font-semibold">{token0Deposited?.toSignificant(6)}</div>
                  <CurrencyLogo size="20px" currency={currency0} />
                </div>
              ) : (
                '-'
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>{i18n._(t`Pooled ${currency1?.symbol}`)}:</div>
              {token1Deposited ? (
                <div className="flex items-center space-x-2">
                  <div className="font-semibold ">{token1Deposited?.toSignificant(6)}</div>
                  <CurrencyLogo size="20px" currency={currency1} />
                </div>
              ) : (
                '-'
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>{i18n._(t`Your pool share`)}:</div>
              <div className="font-semibold">
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'}
              </div>
            </div>
          </div>
          {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                color="blue"
                onClick={() => {
                  router.push(`/add/${currencyId(currency0)}/${currencyId(currency1)}`)
                }}
              >
                {i18n._(t`Add`)}
              </Button>
              <Button
                color="blue"
                onClick={() => {
                  router.push(`/remove/${currencyId(currency0)}/${currencyId(currency1)}`)
                }}
              >
                {i18n._(t`Remove`)}
              </Button>
            </div>
          )}
        </div>
      </Transition>
    </div>
  )
}
