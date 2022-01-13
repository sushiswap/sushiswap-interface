import { Currency } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { formatPercent } from 'app/functions'
import classNames from 'classnames'
import Link from 'next/link'
import React, { FC, useMemo } from 'react'
import { ChevronRight } from 'react-feather'
import { useRecoilValue } from 'recoil'

import { poolAtom } from './context/atoms'
import useCurrenciesFromURL from './context/hooks/useCurrenciesFromURL'
import { PoolUnion } from './types'

export type BreadcrumbTuple = { link?: string; label: string }
export type BreadcrumbItem =
  | ((currencies: (Currency | undefined)[], pool?: PoolUnion) => BreadcrumbTuple)
  | BreadcrumbTuple

export const BREADCRUMBS: Record<string, BreadcrumbItem> = {
  pools: { link: '/trident/pools', label: 'Pools' },
  add_classic: ([a, b]) => ({
    link: `/trident/add/classic/${a ? a.symbol : ''}/${b ? b.symbol : ''}`,
    label: `Add Liquidity`,
  }),
  remove_classic: ([a, b]) => ({
    link: `/trident/add/classic/${a ? a.symbol : ''}/${b ? b.symbol : ''}`,
    label: `Remove Liquidity`,
  }),
  pool_classic: ([a, b], pool) => ({
    link: `/trident/pool/classic/${a ? a.symbol : ''}/${b ? b.symbol : ''}`,
    label: pool
      ? `${pool.token0.symbol}-${pool.token1.symbol} - Classic - ${formatPercent(pool.fee.valueOf() / 100)}`
      : 'Pool not found',
  }),
  liquidity: {
    link: `/trident/balances/liquidity`,
    label: 'Liquidity Positions',
  },
  wallet: {
    link: `/trident/balances/wallet`,
    label: 'Wallet',
  },
  bentobox: {
    link: `/trident/balances/bentobox`,
    label: 'Wallet',
  },
  my_portfolio: {
    link: `/trident/balances`,
    label: 'My Portfolio',
  },
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItem[]
}

const Breadcrumb: FC<BreadcrumbProps> = ({ breadcrumbs }) => {
  const { pool } = useRecoilValue(poolAtom)
  const { currencies } = useCurrenciesFromURL()

  const formatted = useMemo(() => {
    return breadcrumbs.map((el) => {
      if (typeof el === 'function') {
        return el(currencies, pool)
      }

      return el
    }) as BreadcrumbTuple[]
  }, [breadcrumbs, currencies, pool])

  return (
    <div className="flex w-full px-6 py-2 relative">
      <div className="z-0 inset-0 pointer-events-none absolute w-full h-full border-b border-gradient-r-blue-pink-dark-1000 border-transparent opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-opaque-blue to-opaque-pink" />
      </div>
      <div className="flex w-full z-[1]">
        {formatted
          .map(({ label, link }, index) => (
            <Typography
              variant="xs"
              weight={400}
              key={label}
              className={classNames(
                'capitalize',
                index === breadcrumbs.length - 1 ? 'text-high-emphesis' : 'text-secondary'
              )}
            >
              {link ? <Link href={link}>{label}</Link> : label}
            </Typography>
          ))
          .reduce(
            (acc, x) =>
              acc === null ? (
                x
              ) : (
                <>
                  {acc}{' '}
                  <div className="px-1 text-secondary flex flex-col justify-center">
                    <ChevronRight width={12} height={12} strokeWidth={4} />
                  </div>{' '}
                  {x}
                </>
              ),
            null
          )}
      </div>
    </div>
  )
}

export default Breadcrumb
