import Head from 'next/head'
import Layout from '../layouts/DefaultLayout'

export default function Dashboard() {
    return (
        <Layout>
            <Head>
                <title>Dashboard | Sushi</title>
                <meta name="description" content="Sushi" />
            </Head>
        </Layout>
    )
}
