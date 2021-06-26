import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

import Dots from '../../components/Dots'
import Head from 'next/head'
import Typography from '../../components/Typography'
import capitalize from 'lodash/capitalize'
import { classNames } from '../../functions'
import useSWR from 'swr'
import { useState } from 'react'

const getChains = (url = 'https://chainid.network/chains.json') => fetch(url).then((res) => res.json())

export default function Status({ initialData }) {
  const res = useSWR('https://chainid.network/chains.json', getChains, { initialData })
  const [tabIndex, setTabIndex] = useState(0)
  const { data } = res

  return (
    <>
      <Head>
        <title>Chains | Sushi</title>
        <meta name="description" content="Sushi Chains..." />
      </Head>
      <div className="w-full max-w-6xl mx-auto">
        <Typography component="h1" variant="h1" className="w-full mb-4">
          Chains
        </Typography>
        <div className="grid items-start justify-start grid-cols-2 gap-3 mx-auto ">
          {data.map((chain, key) => {
            return (
              <div key={key} className="h-full p-1 rounded bg-dark-900 text-primary">
                <pre className="h-full p-4 rounded bg-dark-1000">
                  <code>{JSON.stringify(chain, null, 2)}</code>
                </pre>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { initialData: await getChains() } }
}
