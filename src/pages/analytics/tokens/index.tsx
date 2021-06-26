import Head from 'next/head'
import Container from '../../../components/Container'
import Menu from '../../../features/analytics/AnalyticsMenu'
import TokenList from '../../../features/analytics/Pairs/TokenList'
import { useEthPrice, useOneDayBlock, useOneWeekBlock, useTokens } from '../../../services/graph'
import Search from '../../../components/Search'
import { useFuse } from '../../../hooks'
import { tokensTimeTravelQuery } from '../../../services/graph/queries'

export default function Pairs() {
  const oneDayBlock = useOneDayBlock().data?.blocks
  const block1d = oneDayBlock ? Number(oneDayBlock[oneDayBlock.length - 1].number) : undefined

  const oneWeekBlock = useOneWeekBlock().data?.blocks
  const block1w = oneWeekBlock ? Number(oneWeekBlock[oneWeekBlock.length - 1].number) : undefined

  const ethPrice = useEthPrice().data
  const ethPrice1d = useEthPrice({ block: { number: block1d } }).data
  const ethPrice1w = useEthPrice({ block: { number: block1w } }).data

  const tokens = useTokens().data
  const tokens1d = useTokens({ block: { number: block1d } }, tokensTimeTravelQuery).data
  const tokens1w = useTokens({ block: { number: block1w } }, tokensTimeTravelQuery).data

  const tokensFormatted =
    tokens && tokens1d && tokens1w && ethPrice && ethPrice1d && ethPrice1w
      ? tokens.map((token) => {
          const token1d = tokens1d.find((p) => token.id === p.id) ?? token
          const token1w = tokens1w.find((p) => token.id === p.id) ?? token

          return {
            token: {
              address: token.id,
              symbol: token.symbol,
              name: token.name,
            },
            liquidity: token.liquidity * token.derivedETH * ethPrice,
            volume24h: token.volumeUSD - token1d.volumeUSD,
            price: token.derivedETH * ethPrice,
            change1d: ((token.derivedETH * ethPrice) / (token1d.derivedETH * ethPrice1d)) * 100 - 100,
            change1w: ((token.derivedETH * ethPrice) / (token1w.derivedETH * ethPrice1w)) * 100 - 100,
          }
        })
      : []

  const options = {
    keys: ['token.address', 'token.symbol', 'token.name'],
    threshold: 0.4,
  }

  const {
    result: tokensSearched,
    term,
    search,
  } = useFuse({
    data: tokensFormatted,
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
            <div className="ml-3 font-bold text-2xl text-high-emphesis">Tokens</div>
          </div>
          <Search term={term} search={search} />
          <TokenList tokens={tokensSearched} />
        </div>
      </Container>
    </>
  )
}
