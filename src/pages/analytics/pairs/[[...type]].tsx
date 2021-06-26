import Head from 'next/head'
import Typography from '../../../components/Typography'
import Container from '../../../components/Container'
import Menu from '../../../features/analytics/AnalyticsMenu'
import PairList from '../../../features/analytics/Pairs/PairList'
import { useOneDayBlock, useOneWeekBlock, useCustomDayBlock, usePairs } from '../../../services/graph'
import PairTabs from '../../../features/analytics/Pairs/PairTabs'
import { useRouter } from 'next/router'
import Search from '../../../components/Search'
import { useFuse } from '../../../hooks'

export default function Pairs() {
  const router = useRouter()
  const type: any = ['all', 'gainers', 'losers'].includes(router.query.type?.[0]) ? router.query.type?.[0] : 'all'

  const block1d = useOneDayBlock().data?.blocks[0]?.number ?? undefined
  const block2d = useCustomDayBlock(2).data?.blocks[0]?.number ?? undefined
  const block1w = useOneWeekBlock().data?.blocks[0]?.number ?? undefined
  const block2w = useCustomDayBlock(14).data?.blocks[0]?.number ?? undefined

  const pairs = usePairs().data
  const pairs1d = usePairs({ block: { number: Number(block1d) } }).data
  const pairs2d = usePairs(type !== 'all' ? { block: { number: Number(block2d) } } : undefined).data // No need to fetch if we don't need the data
  const pairs1w = usePairs({ block: { number: Number(block1w) } }).data
  const pairs2w = usePairs(type !== 'all' ? { block: { number: Number(block2w) } } : undefined).data

  const pairsFormatted =
    type === 'all'
      ? pairs && pairs1d && pairs1w
        ? pairs.map((pair) => {
            const pair1d = pairs1d.find((p) => pair.id === p.id) ?? pair
            const pair1w = pairs1w.find((p) => pair.id === p.id) ?? pair1d

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
              volume1d: pair.volumeUSD - pair1d.volumeUSD,
              volume1w: pair.volumeUSD - pair1w.volumeUSD,
            }
          })
        : []
      : pairs && pairs1d && pairs2d && pairs1w && pairs2w
      ? pairs
          .map((pair) => {
            const pair1d = pairs1d.find((p) => pair.id === p.id) ?? pair
            const pair2d = pairs2d.find((p) => pair.id === p.id) ?? pair1d
            const pair1w = pairs1w.find((p) => pair.id === p.id) ?? pair2d
            const pair2w = pairs2w.find((p) => pair.id === p.id) ?? pair1w

            return {
              pair: {
                address0: pair.token0.id,
                address1: pair.token1.id,
                symbol0: pair.token0.symbol,
                symbol1: pair.token1.symbol,
                name0: pair.token0.name,
                name1: pair.token1.name,
              },
              liquidityChangeNumber1d: pair.reserveUSD - pair1d.reserveUSD,
              liquidityChangePercent1d: (pair.reserveUSD / pair1d.reserveUSD) * 100 - 100,
              liquidityChangeNumber1w: pair.reserveUSD - pair1w.reserveUSD,
              liquidityChangePercent1w: (pair.reserveUSD / pair1w.reserveUSD) * 100 - 100,

              volumeChangeNumber1d: pair.volumeUSD - pair1d.volumeUSD - (pair1d.volumeUSD - pair2d.volumeUSD),
              volumeChangePercent1d:
                ((pair.volumeUSD - pair1d.volumeUSD) / (pair1d.volumeUSD - pair2d.volumeUSD)) * 100 - 100,
              volumeChangeNumber1w: pair.volumeUSD - pair1w.volumeUSD - (pair1w.volumeUSD - pair2w.volumeUSD),
              volumeChangePercent1w:
                ((pair.volumeUSD - pair1w.volumeUSD) / (pair1w.volumeUSD - pair2w.volumeUSD)) * 100 - 100,
            }
          })
          .sort((a, b) => b.liquidityChangeNumber1d - a.liquidityChangeNumber1d)
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
          <PairList pairs={pairsSearched} type={type} />
        </div>
      </Container>
    </>
  )
}
