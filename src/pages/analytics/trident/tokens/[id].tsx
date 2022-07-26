import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { Feature } from 'app/enums'
import Header from 'app/features/analytics/trident/tokens/Header'
import TokenStats from 'app/features/analytics/trident/tokens/TokenStats'
import TokenStatsChart from 'app/features/analytics/trident/tokens/TokenStatsChart'
import NetworkGuard from 'app/guards/Network'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useTridentTokens } from 'app/services/graph'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const Token = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const { query } = router
  const chainId = Number(query.chainId) as ChainId
  const id = query.id
  const { data: tokens } = useTridentTokens({ chainId, variables: { where: { id } } })

  if (!tokens || tokens.length === 0) return null

  const token = tokens[0]
  return (
    <>
      <NextSeo title={`Trident Token ${token.symbol} Fee ${Number(token.kpi.fees) / 10000}`} />
      <TridentHeader pattern="bg-chevron" condensed className="lg:py-[22px]">
        <div className="flex flex-col gap-3 lg:w-8/12 lg:gap-5 lg:pr-6 h-[68px] lg:h-auto">
          <div>
            <Button
              color="blue"
              variant="outlined"
              size="sm"
              className="rounded-full !pl-2 !py-1.5"
              startIcon={<ChevronLeftIcon width={24} height={24} />}
            >
              <Link href={'/analytics/trident'}>{i18n._(t`Trident Analytics`)}</Link>
            </Button>
          </div>
        </div>
      </TridentHeader>

      <TridentBody className="lg:pt-[26px]">
        <div className="mt-[-54px] lg:mt-[-12px]">
          <div className="mb-5 order-0">
            <Header token={token} chainId={chainId} />
          </div>
        </div>
        <TokenStatsChart token={token} chainId={chainId} />
        <TokenStats token={token} chainId={chainId} />
      </TridentBody>
    </>
  )
}

Token.Guard = NetworkGuard(Feature.TRIDENT)
Token.Layout = TridentLayout

export default Token
