import { InformationCircleIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/core-sdk'
import Container from 'app/components/Container'
import ExternalLink from 'app/components/ExternalLink'
import Search from 'app/components/Search'
import Typography from 'app/components/Typography'
import { Chef, PairType } from 'app/features/onsen/enum'
import FarmList from 'app/features/onsen/FarmList'
import Menu from 'app/features/onsen/FarmMenu'
import { usePositions } from 'app/features/onsen/hooks'
import { classNames } from 'app/functions/styling'
import useFarmRewards from 'app/hooks/useFarmRewards'
import useFuse from 'app/hooks/useFuse'
import { useActiveWeb3React } from 'app/services/web3'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

export default function Farm(): JSX.Element {
  const { chainId } = useActiveWeb3React()

  const router = useRouter()
  const type = router.query.filter === null ? 'all' : (router.query.filter as string)

  // @ts-ignore TYPE NEEDS FIXING
  const positions = usePositions(chainId)

  const FILTER = {
    // @ts-ignore TYPE NEEDS FIXING
    all: (farm) => farm.allocPoint !== '0' && farm.chef !== Chef.OLD_FARMS,
    // @ts-ignore TYPE NEEDS FIXING
    portfolio: (farm) => farm?.amount && !farm.amount.isZero(),
    // @ts-ignore TYPE NEEDS FIXING
    sushi: (farm) => farm.pair.type === PairType.SWAP && farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    kashi: (farm) => farm.pair.type === PairType.KASHI && farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    '2x': (farm) =>
      (farm.chef === Chef.MASTERCHEF_V2 || farm.chef === Chef.MINICHEF) &&
      farm.rewards.length > 1 &&
      farm.allocPoint !== '0',
    // @ts-ignore TYPE NEEDS FIXING
    old: (farm) => farm.chef === Chef.OLD_FARMS,
  }

  const rewards = useFarmRewards()

  const data = rewards.filter((farm) => {
    // @ts-ignore TYPE NEEDS FIXING
    return type in FILTER ? FILTER[type](farm) : true
  })

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  return (
    <Container id="farm-page" className="grid h-full grid-cols-4 py-4 mx-auto md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Farm | Sushi</title>
        <meta key="description" name="description" content="Farm SUSHI" />
        <meta key="twitter:description" name="twitter:description" content="Farm SUSHI" />
        <meta key="og:description" property="og:description" content="Farm SUSHI" />
      </Head>
      <div className={classNames('sticky top-0 hidden lg:block md:col-span-1')} style={{ maxHeight: '40rem' }}>
        <Menu positionsLength={positions.length} />
      </div>
      <div className={classNames('space-y-6 col-span-4 lg:col-span-3')}>
        {chainId && chainId === ChainId.CELO && (
          <div className="bg-[rgba(255,255,255,0.04)] p-4 py-2 rounded flex flex-row items-center gap-4">
            <InformationCircleIcon width={28} height={28} color="pink" />
            <Typography variant="xs" weight={700}>
              <ExternalLink
                id={`celo-optics-info-link`}
                href="https://medium.com/@0xJiro/celo-farms-update-migrating-to-the-optics-v2-bridge-e8075d1c9ea"
                className="text-high-emphesis"
              >
                {`Click for more info on Optics V1 Migration.`}
              </ExternalLink>
            </Typography>
          </div>
        )}
        <Search
          search={search}
          term={term}
          inputProps={{
            className:
              'relative w-full bg-transparent border border-transparent focus:border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5',
          }}
        />
        {/* <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
            Ready to Stake{' '}
            <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
          </div>
          <FarmList farms={filtered} term={term} /> */}
        <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
          Farms{' '}
          <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
        </div>

        <FarmList farms={result} term={term} />
      </div>
    </Container>
  )
}
