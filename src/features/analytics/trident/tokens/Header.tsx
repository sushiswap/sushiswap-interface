import { getAddress } from '@ethersproject/address'
import { LinkIcon } from '@heroicons/react/outline'
import { useLingui } from '@lingui/react'
import { ChainId, Token } from '@sushiswap/core-sdk'
import CopyHelper from 'app/components/AccountDetails/Copy'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { formatNumber, getExplorerLink, shortenAddress } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import Link from 'next/link'
import { FC, useMemo } from 'react'

interface HeaderProps {
  chainId: ChainId
  token?: any
}

export const Header: FC<HeaderProps> = ({ token, chainId }) => {
  const { i18n } = useLingui()
  const isDesktop = useDesktopMediaQuery()
  const allTokens = useAllTokens()
  const currency = useMemo(() => {
    const address = getAddress(token.id)
    return address in allTokens
      ? allTokens[address]
      : new Token(chainId, address, Number(token.decimals), token.symbol, token.name)
  }, [token, allTokens, chainId])
  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2 lg:gap-5">
        <div className="lg:flex lg:flex-row lg:gap-3 lg:order-0 lg:items-center">
          <CurrencyLogo currency={currency} size={64} />
        </div>
        <div className="flex flex-row items-center gap-2 lg:order-2">
          <div className="flex flex-col">
            {token && (
              <Link href={getExplorerLink(chainId, token.id, 'address')} passHref={true}>
                <a target="_blank">
                  <Typography
                    id={`token-title-${token.id}`}
                    variant={isDesktop ? 'h3' : 'h2'}
                    className="flex gap-1 text-high-emphesis hover:text-blue-100"
                    weight={700}
                  >
                    {token.symbol} <LinkIcon width={20} />
                  </Typography>
                </a>
              </Link>
            )}
            {token && (
              <CopyHelper toCopy={token.id} className="opacity-100 text-primary">
                {shortenAddress(token.id)}
              </CopyHelper>
            )}
          </div>
        </div>
      </div>
      <div className="text-right mt-[-54px] lg:mt-0">
        <div>
          <Typography variant="sm" weight={700}>
            {i18n._('Price')}
          </Typography>
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {formatNumber(token.price.derivedUSD, true)}
          </Typography>
        </div>
        <div className="mt-2">
          <Typography variant="sm" weight={700}>
            {i18n._('Liquidity')}
          </Typography>
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {formatNumber(token.kpi.liquidityUSD, true)}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default Header
