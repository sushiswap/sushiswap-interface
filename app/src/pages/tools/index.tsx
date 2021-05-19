import { ArrowRightIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import Layout from '../../components/Layout'
import Link from 'next/link'
import Typography from '../../components/Typography'
import { ArrowRightIcon } from '@heroicons/react/outline'

const tools = [
    {
        id: 1,
        name: 'MEOWSHI',
        description: 'Redonominate xSUSHI into MEOWSHI',
        href: '/tools/meowshi'
    },
    {
        id: 2,
        name: 'SAAVE',
        description: '...',
        href: '/tools/saave'
    }
]

export default function Tools() {
    return (
        <Layout>
            <Head>
                <title>Tools | Sushi</title>
                <meta name="description" content="SushiSwap tools..." />
            </Head>
            <div className="w-screen max-w-xl space-y-4">
                <Typography variant="h1">Tools</Typography>
                <ul className="divide-y-0 space-y-4">
                    {tools.map(tools => (
                        <li key={tools.id} className="w-full relative rounded bg-dark-900 hover:bg-dark-800 p-4">
                            <div className="flex justify-between space-x-4">
                                <div className="min-w-0 flex-1">
                                    <Link href={tools.href}>
                                        <a className="flex justify-between items-center focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            <div className="space-y-1">
                                                <p className="text-xl font-bold text-primary truncate">{tools.name}</p>
                                                <p className="text-sm text-secondary truncate">{tools.description}</p>
                                            </div>
                                            <ArrowRightIcon width={24} height={24} className="text-high-emphesis" />
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    )
}
