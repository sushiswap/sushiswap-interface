import Container from 'app/components/Container'
import Head from 'next/head'

export default function Status({ initialData }) {
  //   const res = useChainsStatus({ initialData })
  //   const { data } = res.data
  return (
    <Container id="status-page" className="py-4 md:py-8 lg:py-12" maxWidth="full">
      <Head>
        <title>Status | Sushi</title>
        <meta key="description" name="description" content="Sushi Status..." />
        <meta key="twitter:description" name="twitter:description" content="Sushi Status..." />
        <meta key="og:description" property="og:description" content="Sushi Status..." />
      </Head>
      {/* <div className="w-full max-w-6xl mx-auto">
                <Typography component="h1" variant="h1" className="w-full mb-4">
                    Status
                </Typography>

        <Tab.Group>
          <Tab.List className="flex">
            <Tab
              className={({ selected }) =>
                classNames(
                  !selected && 'text-gray-500 hover:text-gray-700',
                  'py-4 px-4 text-center font-medium text-sm cursor-pointer'
                )
              }
            >
              Covalent
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  !selected && 'text-gray-500 hover:text-gray-700',
                  'py-4 px-4 text-center font-medium text-sm cursor-pointer'
                )
              }
            >
              Subgraph
            </Tab>
          </Tab.List>
          <Tab.Panel>
            <div className="grid items-start justify-start grid-cols-3 gap-4 mx-auto ">
              {data.items.map((item) => {
                const words = item.name.split('-')
                return (
                  <div className="p-4 rounded bg-dark-900 text-primary">
                    <Typography variant="h3">{words.map((word) => `${capitalize(word)} `)}</Typography>
                    <Typography variant="sm" className="text-secondary">
                      Chain Id: {item['chain_id']}
                    </Typography>
                    <Typography variant="sm" className="text-secondary">
                      Block Height: {item['synced_block_height']}
                    </Typography>
                  </div>
                )
              })}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid items-start justify-start grid-cols-3 gap-4 mx-auto ">
              <div className="p-4 text-primary">
                <Typography variant="h3">
                  <Dots>Under Construction</Dots>
                </Typography>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Group>
            </div>*/}

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </Container>
  )
}

// export async function getStaticProps() {
//     return { props: { initialData: await getChainsStatus() } }
// }
