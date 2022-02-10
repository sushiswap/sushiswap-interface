import Container from 'app/components/Container'
import { useKashiPair } from 'app/features/kashi/hooks'
import { KashiMarket, KashiMarketSkeleton } from 'app/features/kashi/KashiMarket'
import KashiMarketProvider from 'app/features/kashi/KashiMarket/KashiMarketContext'
import { useRedirectOnChainId } from 'app/hooks/useRedirectOnChainId'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

interface KashiPairPage {}

const KashiPairPage: FC<KashiPairPage> = () => {
  const router = useRouter()
  const market = useKashiPair(router.query.pair as string)

  useRedirectOnChainId('/kashi')

  return (
    <Container maxWidth="lg" className="py-4 md:py-12 lg:py-[120px] px-2">
      {market ? (
        <KashiMarketProvider market={market}>
          <KashiMarket />
        </KashiMarketProvider>
      ) : (
        <KashiMarketSkeleton />
      )}
    </Container>
  )
}

export default KashiPairPage
