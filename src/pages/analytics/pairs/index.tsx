import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

import Head from 'next/head'
import NavLink from '../../../components/NavLink'
import Typography from '../../../components/Typography'

export default function Pairs() {
  return (
    <>
      <Head>
        <title>SushiSwap Liquidity Pair (SLP) Analytics | Sushi</title>
        <meta name="description" content="SushiSwap Liquidity Pair (SLP) Analytics by Sushi" />
      </Head>
      <Typography variant="h2" component="h1" className="text-high-emphesis">
        Pairs
      </Typography>

      <NavLink>All</NavLink>
    </>
  )
}
