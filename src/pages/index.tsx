import Container from '../components/Container';
import Head from 'next/head';
import Link from 'next/link';
import { APP_NAME, APP_NAME_URL } from '../constants';
import { useWeb3React } from '@web3-react/core';
import { ChainId } from '@sushiswap/sdk';

export default function Dashboard() {
  // usePasswordCheck();
  const { chainId } = useWeb3React();

  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>{APP_NAME_URL}</title>
        <meta name="description" content={APP_NAME} />
      </Head>

      {chainId === ChainId.MATIC && (
        <div>
          <p className="font-semibold">
            EthOnline Hackathon version - <span className="text-dark-500">you are on polygon mainnet</span> - do not use
          </p>
        </div>
      )}

      <PageLink linkHref="/markets" linkText="Markets" />
      <PageLink linkHref="/quick" linkText="QuickBorrow" />
      <PageLink linkHref="/lend" linkText="Deposit+Borrow" />
      <PageLink linkHref="/yield" linkText="Yield Strategies" />
      <PageLink linkHref="/dashboard" linkText="Dashboard" />
    </Container>
  );
}

const PageLink = ({ linkHref, linkText }) => (
  <div className="p-4 mt-8 rounded-lg shadow-lg bg-dark-900 text-secondary">
    <div>
      go to
      <span className="ml-1 font-semibold hover:text-high-emphesis">
        <Link href={linkHref}>
          <a>{linkText}</a>
        </Link>
      </span>
    </div>
  </div>
);
