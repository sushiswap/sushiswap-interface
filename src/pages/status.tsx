import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

import Dots from '../components/Dots'
import Head from 'next/head'
import Typography from '../components/Typography'
import capitalize from 'lodash/capitalize'
import { classNames } from '../functions'
import { getChainsStatus } from '../services/covalent/fetchers'
import { useChainsStatus } from '../services/covalent/hooks'
import { useState } from 'react'

export default function Status({ initialData }) {
  // const res = useChainsStatus({ initialData })
  // const [tabIndex, setTabIndex] = useState(0)
  // const { data } = res.data
  return (
    <>
      <Head>
        <title>Status | Sushi</title>
        <meta name="description" content="Sushi Status..." />
      </Head>
      {/* <div className="w-full max-w-6xl mx-auto">
                <Typography component="h1" variant="h1" className="w-full mb-4">
                    Status
                </Typography>

                <Tabs
                    selectedIndex={tabIndex}
                    onSelect={(index) => setTabIndex(index)}
                    selectedTabClassName="bg-none"
                >
                    <TabList className="flex">
                        <Tab
                            className={classNames(
                                tabIndex !== 0 &&
                                    'text-gray-500 hover:text-gray-700',
                                'py-4 px-4 text-center font-medium text-sm cursor-pointer'
                            )}
                        >
                            Covalent
                        </Tab>
                        <Tab
                            className={classNames(
                                tabIndex !== 1 &&
                                    'text-gray-500 hover:text-gray-700',
                                'py-4 px-4 text-center font-medium text-sm cursor-pointer'
                            )}
                        >
                            Subgraph
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <div className="grid items-start justify-start grid-cols-3 gap-4 mx-auto ">
                            {data.items.map((item) => {
                                const words = item.name.split('-')
                                return (
                                    <div className="p-4 rounded bg-dark-900 text-primary">
                                        <Typography variant="h3">
                                            {words.map(
                                                (word) => `${capitalize(word)} `
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="sm"
                                            className="text-secondary"
                                        >
                                            Chain Id: {item['chain_id']}
                                        </Typography>
                                        <Typography
                                            variant="sm"
                                            className="text-secondary"
                                        >
                                            Block Height:{' '}
                                            {item['synced_block_height']}
                                        </Typography>
                                    </div>
                                )
                            })}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="grid items-start justify-start grid-cols-3 gap-4 mx-auto ">
                            <div className="p-4 text-primary">
                                <Typography variant="h3">
                                    <Dots>Under Construction</Dots>
                                </Typography>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div> */}

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </>
  )
}

// export async function getStaticProps() {
//     return { props: { initialData: await getChainsStatus() } }
// }
