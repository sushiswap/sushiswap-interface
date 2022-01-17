import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ConstantProductPool } from '@sushiswap/trident-sdk'
import Chip from 'app/components/Chip'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions/styling'
import { PoolWithState } from 'app/types'
import Link from 'next/link'
import React, { FC } from 'react'

interface PoolCardProps {
  poolWithState: PoolWithState<ConstantProductPool>
  link: string
}

const PoolCard: FC<PoolCardProps> = ({ poolWithState, link }) => {
  const { i18n } = useLingui()
  const { pool } = poolWithState

  if (!pool) return <></>

  const currencies = [pool.token0, pool.token1]

  // TODO ramin: remove
  const isFarm = true
  const apy = '3.6'

  const content = (
    <div className="overflow-hidden border rounded border-dark-700 bg-dark-900">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <CurrencyLogoArray currencies={currencies} size={30} dense maxLogos={4} />
          <Chip label={i18n._(t`Classic`)} color="default" />
        </div>
        <div className="flex gap-1.5 items-baseline">
          <Typography className={isFarm ? '' : 'text-secondary'} variant="sm" weight={400}>
            {isFarm ? i18n._(t`FARM APY`) : i18n._(t`APY`)}
          </Typography>
          <Typography
            className={classNames(
              +apy > 25 ? 'bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent' : 'text-high-emphesis',
              'leading-5'
            )}
            variant="lg"
            weight={700}
          >
            {apy}%
          </Typography>
          {isFarm && (
            <svg
              className="text-high-emphesis"
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.8053 0.409055C12.8989 0.502598 12.9548 0.627216 12.9626 0.759278C13.2657 5.91121 11.7124 10.0374 8.80757 11.7967C7.87713 12.3668 6.80654 12.667 5.71534 12.6639C5.6405 12.6639 5.56557 12.6626 5.49013 12.6599C4.41275 12.6215 3.32519 12.3073 2.25172 11.7266L9.0243 4.95396C9.12549 4.85264 9.18231 4.71529 9.18226 4.57209C9.18222 4.4289 9.12532 4.29158 9.02406 4.19033C8.92281 4.08907 8.78549 4.03217 8.6423 4.03213C8.4991 4.03208 8.36175 4.0889 8.26043 4.19009L1.48784 10.9627C0.907126 9.88917 0.592859 8.80163 0.554467 7.72425C0.507305 6.55735 0.807762 5.40272 1.41773 4.40682C3.177 1.50201 7.30255 -0.0515687 12.4551 0.251769C12.5872 0.259546 12.7118 0.315511 12.8053 0.409055ZM1.48784 10.9627C1.55448 11.0859 1.62376 11.2089 1.69743 11.3317C1.74304 11.4077 1.80668 11.4714 1.88271 11.517C2.00549 11.5907 2.12854 11.6599 2.25172 11.7266L0.922094 13.0562C0.82079 13.1575 0.683395 13.2144 0.540136 13.2144C0.396877 13.2144 0.259488 13.1575 0.158193 13.0562C0.0568973 12.9549 -6.20011e-06 12.8175 5.06695e-10 12.6742C6.20315e-06 12.5309 0.0569218 12.3936 0.158226 12.2923L1.48784 10.9627Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center bg-dark-800 px-3 pt-2.5 pb-1.5">
        <div className="flex flex-col gap-0.5">
          <Typography className="leading-5 text-high-emphesis" variant="lg" weight={400}>
            {currencies.map((token) => token.symbol).join('-')}
          </Typography>
          <Typography className="text-high-emphesis" variant="xxs">
            $1,504,320
          </Typography>
        </div>
        <Typography className="leading-5 text-blue" variant="xs" weight={700}>
          {pool.fee} {i18n._(t`Fees`)}
        </Typography>
      </div>
    </div>
  )

  if (link)
    return (
      <Link
        href={{
          pathname: `/trident/pool`,
          query: {
            tokens: pool.assets.map((el) => el.address),
            fee: pool.fee,
            twap: pool.twap,
          },
        }}
      >
        {content}
      </Link>
    )

  return content
}

export default PoolCard
