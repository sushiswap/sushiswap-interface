import Head from 'next/head'
import Layout from '../../layouts/DefaultLayout'
import { useRouter } from 'next/router'

export default function Token() {
    const router = useRouter()
    const { id } = router.query
    return (
        <Layout>
            <Head>
                <title>Token {id} | Sushi</title>
                <meta name="description" content="SushiSwap tokens." />
            </Head>
        </Layout>
    )
}
