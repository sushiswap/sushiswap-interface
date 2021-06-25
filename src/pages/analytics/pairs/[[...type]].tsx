import Head from 'next/head'
import Typography from '../../../components/Typography'
import Container from '../../../components/Container'
import Menu from '../../../features/analytics/AnalyticsMenu'
import PairList from '../../../features/analytics/Pairs/PairList'
import { useOneDayBlock, useOneWeekBlock, usePairs } from '../../../services/graph'
import PairTabs from '../../../features/analytics/Pairs/PairTabs'
import { useRouter } from 'next/router'
import Search from '../../../components/Search'
import { useFuse } from '../../../hooks'

export default function Pairs() {
  const router = useRouter()
  const type = router.query.type?.[0] ?? 'all'

  const oneDayBlock = useOneDayBlock().data?.blocks
  const block1d = oneDayBlock ? Number(oneDayBlock[oneDayBlock.length - 1].number) : undefined

  const oneWeekBlock = useOneWeekBlock().data?.blocks
  const block1w = oneWeekBlock ? Number(oneWeekBlock[oneWeekBlock.length - 1].number) : undefined

  const pairs = usePairs().data
  const pairs1d = usePairs({ block: { number: block1d } }).data
  const pairs1w = usePairs({ block: { number: block1w } }).data

  const pairsFormatted =
    pairs && pairs1d && pairs1w
      ? pairs.map((pair) => {
          const pair1d = pairs1d.find((p) => pair.id === p.id) ?? pair
          const pair1w = pairs1w.find((p) => pair.id === p.id) ?? pair

          return {
            pair: {
              address0: pair.token0.id,
              address1: pair.token1.id,
              symbol0: pair.token0.symbol,
              symbol1: pair.token1.symbol,
              name0: pair.token0.name,
              name1: pair.token1.name,
            },
            liquidity: pair.reserveUSD,
            volume24h: pair.volumeUSD - pair1d.volumeUSD,
            volume7d: pair.volumeUSD - pair1w.volumeUSD,
          }
        })
      : []

  const options = {
    keys: ['pair.currency0', 'pair.currency1', 'pair.symbol0', 'pair.symbol1', 'pair.name0', 'pair.name1'],
    threshold: 0.4,
  }

  const {
    result: pairsSearched,
    term,
    search,
  } = useFuse({
    data: pairsFormatted,
    options,
  })

  return (
    <>
      <Head>
        <title>SushiSwap Liquidity Pair (SLP) Analytics | Sushi</title>
        <meta name="description" content="SushiSwap Liquidity Pair (SLP) Analytics by Sushi" />
      </Head>

      <Container maxWidth="full" className="grid h-full grid-cols-5 mx-auto gap-9 grid-flow-col">
        <div className="sticky top-0 hidden lg:block md:col-span-1" style={{ maxHeight: '40rem' }}>
          <Menu />
        </div>
        <div className="col-span-5 space-y-6 lg:col-span-4">
          <div className="flex flex-row items-center">
            <div className="ml-3 font-bold text-2xl text-high-emphesis">Pairs</div>
          </div>
          <Search term={term} search={search} />
          <PairTabs current={type} />
          <PairList pairs={pairsSearched} />
        </div>
      </Container>
    </>
  )
}
