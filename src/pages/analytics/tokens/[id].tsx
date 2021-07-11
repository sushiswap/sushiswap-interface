import { times } from 'lodash'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import Container from '../../../components/Container'
import CurrencyLogo from '../../../components/CurrencyLogo'
import LineGraph from '../../../components/LineGraph'
import ColoredNumber from '../../../features/analytics/ColoredNumber'
import CurrencyCard from '../../../features/analytics/Tokens/Token/CurrencyCard'
import InfoCard from '../../../features/analytics/Tokens/Token/InfoCard'
import TopFarmsList from '../../../features/analytics/Tokens/Token/TopFarmsList'
import TransactionList from '../../../features/analytics/Tokens/Token/TransactionList'
import { classNames, formatNumber } from '../../../functions'
import { useCurrency } from '../../../hooks/Tokens'
import {
  useCustomDayBlock,
  useEthPrice,
  useFarms,
  useOneDayBlock,
  useSushiPairs,
  useToken,
  useTokenPairs,
  useTransactions,
} from '../../../services/graph'
import { tokenDayDatasQuery } from '../../../services/graph/queries'

const socialsPlaceholder = [
  {
    href: 'https://twitter.com',
    icon: (
      <svg width="29" height="24" viewBox="0 0 29 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M28.4506 2.74461C27.3795 3.21321 26.3084 3.54792 25.1034 3.6818C26.3084 2.94543 27.2456 1.80743 27.6472 0.468586C26.5092 1.13801 25.2373 1.6066 23.9654 1.87436C22.8943 0.736357 21.3547 0 19.6811 0C16.4679 0 13.8571 2.61073 13.8571 5.82394C13.8571 6.29254 13.924 6.76112 13.991 7.16279C9.10418 6.895 4.81986 4.61898 1.94133 1.07107C1.40579 1.94131 1.13802 2.94543 1.13802 4.0165C1.13802 6.02477 2.14216 7.8322 3.74878 8.90325C2.81159 8.90325 1.87439 8.6355 1.07108 8.1669V8.23384C1.07108 11.0454 3.07936 13.4553 5.75706 13.9908C5.28846 14.1247 4.75292 14.1917 4.21737 14.1917C3.81573 14.1917 3.48101 14.1247 3.1463 14.0578C3.88267 16.4007 6.02483 18.0743 8.63558 18.1412C6.62731 19.6809 4.15044 20.6181 1.40579 20.6181C0.937199 20.6181 0.468605 20.6181 0 20.5511C2.61076 22.2247 5.62317 23.1619 8.97029 23.1619C19.748 23.1619 25.5721 14.2586 25.5721 6.5603C25.5721 6.29254 25.5721 6.02477 25.5721 5.82394C26.7101 4.9537 27.7142 3.88262 28.4506 2.74461Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    href: 'https://discord.com',
    icon: (
      <svg width="25" height="29" viewBox="0 0 25 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.91417 11.9858C9.09989 11.9858 8.45703 12.7001 8.45703 13.5716C8.45703 14.443 9.11417 15.1573 9.91417 15.1573C10.7285 15.1573 11.3713 14.443 11.3713 13.5716C11.3856 12.7001 10.7285 11.9858 9.91417 11.9858ZM15.1285 11.9858C14.3142 11.9858 13.6713 12.7001 13.6713 13.5716C13.6713 14.443 14.3285 15.1573 15.1285 15.1573C15.9427 15.1573 16.5856 14.443 16.5856 13.5716C16.5856 12.7001 15.9427 11.9858 15.1285 11.9858Z"
          fill="white"
        />
        <path
          d="M22.0714 0H2.92857C1.31429 0 0 1.31429 0 2.94286V22.2571C0 23.8857 1.31429 25.2 2.92857 25.2H19.1286L18.3714 22.5571L20.2 24.2571L21.9286 25.8571L25 28.5714V2.94286C25 1.31429 23.6857 0 22.0714 0ZM16.5571 18.6571C16.5571 18.6571 16.0429 18.0429 15.6143 17.5C17.4857 16.9714 18.2 15.8 18.2 15.8C17.6143 16.1857 17.0571 16.4571 16.5571 16.6429C15.8429 16.9429 15.1571 17.1429 14.4857 17.2571C13.1143 17.5143 11.8571 17.4429 10.7857 17.2429C9.97143 17.0857 9.27143 16.8571 8.68571 16.6286C8.35714 16.5 8 16.3429 7.64286 16.1429C7.6 16.1143 7.55714 16.1 7.51429 16.0714C7.48571 16.0571 7.47143 16.0429 7.45714 16.0286C7.2 15.8857 7.05714 15.7857 7.05714 15.7857C7.05714 15.7857 7.74286 16.9286 9.55714 17.4714C9.12857 18.0143 8.6 18.6571 8.6 18.6571C5.44286 18.5571 4.24286 16.4857 4.24286 16.4857C4.24286 11.8857 6.3 8.15714 6.3 8.15714C8.35714 6.61428 10.3143 6.65714 10.3143 6.65714L10.4571 6.82857C7.88571 7.57143 6.7 8.7 6.7 8.7C6.7 8.7 7.01429 8.52857 7.54286 8.28571C9.07143 7.61429 10.2857 7.42857 10.7857 7.38571C10.8714 7.37143 10.9429 7.35714 11.0286 7.35714C11.9 7.24286 12.8857 7.21429 13.9143 7.32857C15.2714 7.48571 16.7286 7.88571 18.2143 8.7C18.2143 8.7 17.0857 7.62857 14.6571 6.88571L14.8571 6.65714C14.8571 6.65714 16.8143 6.61428 18.8714 8.15714C18.8714 8.15714 20.9286 11.8857 20.9286 16.4857C20.9286 16.4857 19.7143 18.5571 16.5571 18.6571Z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    href: 'https://medium.com',
    icon: (
      <svg width="29" height="25" viewBox="0 0 29 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M26.686 2.93816L29 0.527632V0H20.9839L15.2709 15.4842L8.77129 0H0.366125V0.527632L3.06917 4.07105C3.33258 4.33289 3.47033 4.71579 3.43529 5.10132V19.0263C3.51867 19.5276 3.36883 20.0434 3.045 20.4079L0 24.4263V24.9474H8.63354V24.4197L5.58854 20.4079C5.25867 20.0421 5.10279 19.5355 5.16925 19.0263V6.98158L12.7479 24.9539H13.6288L20.1453 6.98158V21.2987C20.1453 21.6763 20.1453 21.7539 19.9182 22.0013L17.574 24.4711V25H28.9468V24.4724L26.6873 22.0632C26.4891 21.9 26.3864 21.6263 26.4287 21.3605V3.64079C26.3864 3.37368 26.4879 3.1 26.686 2.93816Z"
          fill="white"
        />
      </svg>
    ),
  },
]

// TODO: Description, socials
// TODO: Farms: Rewards, ROI

export default function Token(): JSX.Element {
  const [chartTimespan, setChartTimespan] = useState('1W')
  const chartTimespans = ['1W', '1M', 'ALL']

  const router = useRouter()
  const id = (router.query.id as string).toLowerCase()

  const block1d = useOneDayBlock()?.blocks[0]?.number ?? undefined
  const block2d = useCustomDayBlock(2)?.blocks[0]?.number ?? undefined

  // General data (volume, liquidity)
  const ethPrice = useEthPrice()
  const ethPrice1d = useEthPrice({ block: { number: Number(block1d) } })

  const token = useToken({ id: id })
  const token1d = useToken({ id: id, block: { number: Number(block1d) } })
  const token2d = useToken({ id: id, block: { number: Number(block2d) } })

  // For the graph
  const tokenDayData = useToken(
    {
      first: chartTimespan === '1W' ? 7 : chartTimespan === '1M' ? 30 : undefined,
      tokens: [id],
    },
    tokenDayDatasQuery
  )

  // For Top Farms
  const farms = useFarms()
  const farmPairs = useSushiPairs({ where: { id_in: farms.map((farm) => farm.pair) } })
  const farmsFormatted = useMemo(() => {
    return farmPairs
      ? farmPairs
          .filter((farm) => farm.token0.id === id || farm.token1.id === id)
          .map((farm, i) => ({
            pair: {
              token0: {
                id: farm.token0.id,
                symbol: farm.token0.symbol,
              },
              token1: {
                id: farm.token1.id,
                symbol: farm.token1.symbol,
              },
            },
            roi: 10,
            rewards: [<div key={i}></div>],
          }))
          .slice(0, 5)
      : []
  }, [farmPairs])

  // For Transactions
  const tokenPairs = useTokenPairs({ id: id })
  const transactions = useTransactions({ pairAddresses: tokenPairs?.map((pair) => pair.id) })
  const transactionsFormatted = useMemo(() => {
    return transactions
      ? transactions.map((tx) => {
          const base = {
            value: tx.amountUSD,
            address: tx.to,
            time: new Date(Number(tx.timestamp) * 1000),
          }

          if (tx.amount0In === '0') {
            return {
              symbols: {
                incoming: tx.pair.token1.symbol,
                outgoing: tx.pair.token0.symbol,
              },
              incomingAmt: `${formatNumber(tx.amount1In)} ${tx.pair.token1.symbol}`,
              outgoingAmt: `${formatNumber(tx.amount0Out)} ${tx.pair.token0.symbol}`,
              ...base,
            }
          } else {
            return {
              symbols: {
                incoming: tx.pair.token0.symbol,
                outgoing: tx.pair.token1.symbol,
              },
              incomingAmt: `${formatNumber(tx.amount0In)} ${tx.pair.token0.symbol}`,
              outgoingAmt: `${formatNumber(tx.amount1Out)} ${tx.pair.token1.symbol}`,
              ...base,
            }
          }
        })
      : undefined
  }, [transactions])

  // For Top Moving
  const tokenPairs1d = useTokenPairs({ id: id, block: { number: Number(block1d) } })
  const tokenPairsFormatted = useMemo(() => {
    return token && tokenPairs && tokenPairs1d
      ? tokenPairs
          .map((pair) => {
            const pair1d = tokenPairs1d.find((p) => pair.id === p.id) ?? pair

            return {
              id: pair.token0.id === token.id ? pair.token1.id : pair.token0.id,
              symbol: pair.token0.symbol === token.symbol ? pair.token1.symbol : pair.token0.symbol,
              volume1d: pair.volumeUSD - pair1d.volumeUSD,
            }
          })
          .sort((a, b) => b.volume1d - a.volume1d)
          .slice(0, 8)
      : []
  }, [token, tokenPairs, tokenPairs1d])

  // For the logo
  const currency = useCurrency(token?.id)

  // A bit messy, but allows for renders as info comes in
  const data = useMemo(() => {
    return {
      price: token && ethPrice ? token.derivedETH * ethPrice : undefined,
      priceChange:
        token && ethPrice && token1d && ethPrice1d
          ? ((token.derivedETH * ethPrice) / (token1d.derivedETH * ethPrice1d)) * 100 - 100
          : undefined,
      chart: tokenDayData
        ? tokenDayData.sort((a, b) => a.date - b.date).map((day, i) => ({ x: i, y: Number(day.priceUSD) }))
        : undefined,
      liquidity: token && ethPrice ? token.liquidity * token.derivedETH * ethPrice : 0,
      liquidityChange:
        token && token1d && ethPrice && ethPrice1d
          ? ((token.liquidity * token.derivedETH * ethPrice) / (token1d.liquidity * token1d.derivedETH * ethPrice1d)) *
              100 -
            100
          : 0,
      volume1d: token && token1d ? token.volumeUSD - token1d.volumeUSD : 0,
      volume1dChange:
        token && token1d && token2d
          ? ((token.volumeUSD - token1d.volumeUSD) / (token1d.volumeUSD - token2d.volumeUSD)) * 100 - 100
          : 0,
    }
  }, [ethPrice, ethPrice1d, token, token1d, token2d, tokenDayData])

  return (
    <>
      <Container maxWidth="full" className="h-full grid-flow-col grid-cols-10 mx-auto md:grid">
        <div className="col-start-2 2xl:col-start-3">
          <button onClick={() => router.back()} className="font-bold">
            {'<'} Go Back
          </button>
        </div>
        <div className="col-span-6 space-y-10 2xl:col-span-4">
          <div className="flex flex-row">
            <div>
              <Link href="/analytics/tokens">
                <button className="font-bold text-purple">Tokens</button>
              </Link>
            </div>
            <div className="font-bold">&nbsp;{`> ${token?.symbol}`}</div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-4">
              <CurrencyLogo currency={currency} size={53} />
              {token?.symbol.length <= 6 ? (
                <div className="text-4xl font-bold">{token?.symbol}</div>
              ) : (
                <div className="hidden text-4xl font-bold sm:block">{token?.symbol}</div>
              )}
            </div>
            <div className="flex flex-row items-center space-x-4">
              <div className="text-4xl font-bold">{formatNumber(data.price, true)}</div>
              <div>
                <ColoredNumber number={data.priceChange} percent={true} />
              </div>
            </div>
          </div>
          <div className="w-full h-52">
            <LineGraph data={data.chart} stroke={{ gradient: { from: '#27B0E6', to: '#FA52A0' } }} />
          </div>
          <div className="flex flex-row justify-end pb-4 pr-4 space-x-2">
            {chartTimespans.map((timespan, i) => (
              <button
                key={i}
                className={classNames(
                  timespan === chartTimespan ? 'text-high-emphesis' : 'text-secondary',
                  'font-bold'
                )}
                onClick={() => setChartTimespan(timespan)}
              >
                {timespan}
              </button>
            ))}
          </div>
          <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
            <InfoCard text="Liquidity (24H)" number={data.liquidity} percent={data.liquidityChange} />
            <InfoCard text="Volume (24H)" number={data.volume1d} percent={data.volume1dChange} />
            <InfoCard text="Fees (24H)" number={data.volume1d * 0.003} percent={data.volume1dChange} />
          </div>
          <div>
            <div className="space-y-4">
              <div className="flex flex-row justify-between">
                <div className="text-2xl font-bold text-high-emphesis">About {token?.symbol}</div>
                <div>
                  <a
                    href={`https://etherscan.io/token/${token?.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-row items-center text-sm"
                  >
                    View Contract &nbsp;
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.6667 10.6667H1.33333V1.33333H6V0H1.33333C0.593333 0 0 0.6 0 1.33333V10.6667C0 11.4 0.593333 12 1.33333 12H10.6667C11.4 12 12 11.4 12 10.6667V6H10.6667V10.6667ZM7.33333 0V1.33333H9.72667L3.17333 7.88667L4.11333 8.82667L10.6667 2.27333V4.66667H12V0H7.33333Z"
                        fill="#BFBFBF"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="text-lg text-high-emphesis">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis alias corrupti totam sed nihil.
                Temporibus, distinctio pariatur odio vitae voluptate sapiente libero, rerum nihil, ullam laboriosam
                provident asperiores! Inventore aspernatur unde quas eveniet praesentium vel, quae numquam, ducimus
                sequi doloremque omnis rerum atque dolore eos dolores magnam sint sunt incidunt!
              </div>
              <div className="flex flex-row items-center space-x-4">
                {socialsPlaceholder.map((social, i) => (
                  <a key={i} href={social.href}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-5 text-2xl font-bold text-high-emphesis">Top Moving Pairs</div>
            <div className="grid grid-cols-4 grid-rows-2 gap-5">
              {tokenPairsFormatted.map((pair, i) => (
                <div key={i} className="flex items-center justify-center">
                  <CurrencyCard token={pair.id} symbol={pair.symbol} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-5 text-2xl font-bold text-high-emphesis">Top Farms</div>
            <div>
              <TopFarmsList farms={farmsFormatted} />
            </div>
          </div>
        </div>
      </Container>
      <div className="mt-8">
        <TransactionList transactions={transactionsFormatted} />
      </div>
    </>
  )
}
