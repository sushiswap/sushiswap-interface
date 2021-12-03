import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ConstantProductPool } from '@sushiswap/trident-sdk'
import { classNames } from 'app/functions'
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

  if (!pool) return <></>

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {poolBalance?.greaterThan(0) ? (
        <>
          <Button id={`btn-add-stake-liquidity`} variant="outlined" color="gradient" className="text-high-emphesis">

            <Link
              href={{
                pathname: `/trident/add/classic`,
                query: {
                  tokens: [pool.token0.address, pool.token1.address],
                  fee: pool.fee,
                  twap: (pool as ConstantProductPool).twap,
                },
              }}
              passHref={true}
            >
              {isFarm ? i18n._(t`Add Liquidity / Stake`) : i18n._(t`Add Liquidity`)}
            </Link>
          </Button>
          <Button id={`btn-remove-liquidity`} variant="outlined" color="gradient" className="text-high-emphesis">
            <Link
              href={{
                pathname: `/trident/remove/classic`,
                query: {
                  tokens: [pool.token0.address, pool.token1.address],
                  fee: pool.fee,
                  twap: (pool as ConstantProductPool).twap,
                },
              }}
              passHref={true}
            >
              {i18n._(t`Remove Liquidity`)}
            </Link>
          </Button>
        </>
      ) : (
        <Button id={`btn-deposit`} color="gradient" className="text-high-emphesis">
          <Link
            href={{
              pathname: `/trident/add/classic`,
              query: {
                tokens: [pool.token0.address, pool.token1.address],
                fee: pool.fee,
                twap: (pool as ConstantProductPool).twap,
              },
            }}
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
          href={{
            pathname: `/trident/swap`,
            query: {
              tokens: [pool.token0.address, pool.token1.address],
            },
          }}
          passHref={true}
        >
          {i18n._(t`Trade`)}
        </Link>
      </Button>
    </div>
  )
}

export default ClassicLinkButtons
