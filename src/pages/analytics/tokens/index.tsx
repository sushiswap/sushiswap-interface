import useTokensAnalytics from 'app/features/analytics/hooks/useTokensAnalytics'
import { DiscoverHeader } from 'app/features/analytics/tokens/DiscoverHeader'
import TokenSearch from 'app/features/analytics/tokens/TokenSearch'
import TokenTable from 'app/features/analytics/tokens/TokenTable'
import useFuse from 'app/hooks/useFuse'
import { TridentBody } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
export default function Tokens() {
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  const tokens = useTokensAnalytics({ chainId })

  const {
    result: tokensSearched,
    term,
    search,
  } = useFuse({
    data: tokens,
    options: {
      keys: ['token.id', 'token.symbol', 'token.name'],
      threshold: 0.4,
    },
  })

  console.log({ tokensSearched })

  return (
    <>
      <NextSeo title={`Token Anlytics`} />
      <DiscoverHeader />
      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <TokenSearch />
          <TokenTable chainId={chainId} tokens={tokensSearched ?? []} />
        </div>
      </TridentBody>
    </>
  )
}
