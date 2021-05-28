import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'
import Typography from '../components/Typography'
import capitalize from 'lodash/capitalize'
import { useChainsStatus } from '../services/covalent/hooks'

export default function Status() {
    const res = useChainsStatus()
    const { data } = res.data
    return (
        <Layout>
            <Head>
                <title>Status | Sushi</title>
                <meta name="description" content="Sushi Status..." />
            </Head>

            <Typography component="h1" variant="h1" className="mb-6">
                Status
            </Typography>

            <div className="grid items-start justify-start w-full max-w-6xl grid-cols-3 gap-4">
                {data.items.map((item) => {
                    const words = item.name.split('-')
                    return (
                        <div className="p-4 rounded bg-dark-900 text-primary">
                            <div className="text-h5">
                                {words.map(
                                    (word, i) =>
                                        `${capitalize(word)}${
                                            words.length === i ? '' : ' '
                                        }`
                                )}
                            </div>
                            <div className="text-secondary">
                                Chain Id: {item['chain_id']}
                            </div>
                            <div className="text-secondary">
                                Block Height: {item['synced_block_height']}
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </Layout>
    )
}
