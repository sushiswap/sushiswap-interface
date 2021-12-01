import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ConstantProductPool } from '@sushiswap/trident-sdk'
import { classNames, formatPoolLink } from 'app/functions'
import Button from 'components/Button'
import { poolAtom, poolBalanceAtom } from 'features/trident/context/atoms'
import Link from 'next/link'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

const ClassicLinkButtons: FC = () => {
  const { i18n } = useLingui()
  const { pool } = useRecoilValue(poolAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)

  // TODO ramin: make dynamic
  const isFarm = false

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {poolBalance?.greaterThan(0) ? (
        <>
          <Button variant="outlined" color="gradient" className="text-high-emphesis">
            <Link
              href={
                pool
                  ? `/trident/add/classic?${formatPoolLink(
                      [pool.token0.address, pool.token1.address],
                      pool.fee,
                      (pool as ConstantProductPool).twap
                    )}`
                  : ''
              }
              passHref={true}
            >
              {isFarm ? i18n._(t`Add Liquidity / Stake`) : i18n._(t`Add Liquidity`)}
            </Link>
          </Button>
          <Button variant="outlined" color="gradient" className="text-high-emphesis">
            <Link
              href={
                pool
                  ? `/trident/remove/classic?${formatPoolLink(
                      [pool.token0.address, pool.token1.address],
                      pool.fee,
                      (pool as ConstantProductPool).twap
                    )}`
                  : ''
              }
              passHref={true}
            >
              {i18n._(t`Remove Liquidity`)}
            </Link>
          </Button>
        </>
      ) : (
        <Button color="gradient" className="text-high-emphesis">
          <Link
            href={
              pool
                ? `/trident/add/classic?${formatPoolLink(
                    [pool.token0.address, pool.token1.address],
                    pool.fee,
                    (pool as ConstantProductPool).twap
                  )}`
                : ''
            }
            passHref={true}
          >
            {i18n._(t`Deposit`)}
          </Link>
        </Button>
      )}

      <Button
        color="gradient"
        variant="outlined"
        className={classNames(poolBalance?.greaterThan(0) && 'col-span-2', 'text-high-emphesis')}
      >
        <Link
          href={
            pool
              ? `/trident/swap?type=classic&${formatPoolLink(
                  [pool.token0.address, pool.token1.address],
                  pool.fee,
                  (pool as ConstantProductPool).twap
                )}`
              : ''
          }
          passHref={true}
        >
          {i18n._(t`Trade`)}
        </Link>
      </Button>
    </div>
  )
}

export default ClassicLinkButtons
