import { FC, useMemo } from 'react'
import { ChevronRight } from 'react-feather'
import Link from 'next/link'
import Typography from '../../components/Typography'
import { useRecoilValue } from 'recoil'
import { poolAtom } from './context/atoms'
import classNames from 'classnames'
import Container from '../../components/Container'
import { AllPools } from './types'
import { formatPercent } from '../../functions'

export type BreadcrumbTuple = { link: string; label: string }
export type BreadcrumbItem = ((pool: AllPools) => BreadcrumbTuple) | BreadcrumbTuple

export const BREADCRUMBS: Record<string, BreadcrumbItem> = {
  pools: { link: '/trident/pools', label: 'Pools' },
  add_classic: (pool) => ({
    link: `/trident/add/classic/${pool?.token0.address}/${pool?.token1.address}`,
    label: `Add Liquidity`,
  }),
  remove_classic: (pool) => ({
    link: `/trident/add/classic/${pool?.token0.address}/${pool?.token1.address}`,
    label: `Remove Liquidity`,
  }),
  pool_classic: (pool) => ({
    link: `/trident/pool/classic/${pool?.token0.address}/${pool?.token1.address}`,
    label: pool
      ? `${pool?.token0.symbol}-${pool?.token1.symbol} - Classic - ${formatPercent(pool?.fee.valueOf() / 100)}`
      : 'Pool not found',
  }),
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItem[]
}

const Breadcrumb: FC<BreadcrumbProps> = ({ breadcrumbs }) => {
  const [, pool] = useRecoilValue(poolAtom)
  const formatted = useMemo(() => {
    return breadcrumbs.map((el) => {
      if (typeof el === 'function') {
        return el(pool)
      }

      return el
    })
  }, [breadcrumbs, pool])

  return (
    <div className="w-full border-b border-dark-900 py-2 flex justify-center bg-gradient-to-r from-transparent-blue to-transparent-pink">
      <Container maxWidth="7xl" className="px-5 flex items-center">
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
              <Link href={link}>{label}</Link>
            </Typography>
          ))
          .reduce(
            (acc, x) =>
              acc === null ? (
                x
              ) : (
                <>
                  {acc}{' '}
                  <div className="px-1 text-secondary">
                    <ChevronRight width={12} height={12} strokeWidth={4} />
                  </div>{' '}
                  {x}
                </>
              ),
            null
          )}
      </Container>
    </div>
  )
}

export default Breadcrumb
