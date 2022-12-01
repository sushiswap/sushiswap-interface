import { Currency } from '@figswap/core-sdk'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NavLink from 'app/components/NavLink'
import Typography from 'app/components/Typography'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

const getQuery = (input?: Currency, output?: Currency) => {
  if (!input && !output) return

  if (input && !output) {
    // @ts-ignore
    return { inputCurrency: input.address || 'ETH' }
  } else if (input && output) {
    // @ts-ignore
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface HeaderNewProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
  trident?: boolean
  icon: JSX.Element
}

const HeaderNew: FC<HeaderNewProps> = ({ icon, inputCurrency, outputCurrency, trident = false }) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { asPath } = useRouter()
  const isLimitOrder = asPath.startsWith('/limit-order')

  return (
    <div className="flex items-center justify-between gap-2 ml-2 mt-1 mb-1">
      <div className="flex mt-4 mb-4">
        <NavLink
          activeClassName="text-high-emphesis"
          href={{
            pathname: '/add',
          }}
        >
          <Typography weight={700} className="text-secondary hover:text-white">
            {i18n._(t`Add`)}
          </Typography>
        </NavLink>
        {featureEnabled(Feature.LIMIT_ORDERS, chainId) ? (
          <NavLink
            activeClassName="text-high-emphesis"
            href={{
              pathname: '/remove',
            }}
          >
            <Typography weight={700} className="text-secondary hover:text-white">
              {i18n._(t`Remove`)}
            </Typography>
          </NavLink>
        ) : null}
      </div>
      {icon}
    </div>
  )
}

export default HeaderNew
