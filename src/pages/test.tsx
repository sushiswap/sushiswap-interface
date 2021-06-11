import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'

export default function Test() {
    return (
        <Layout>
            <Head>
                <title>Test | Sushi</title>
                <meta name="description" content="Test..." />
            </Head>
        </Layout>
    )
}
