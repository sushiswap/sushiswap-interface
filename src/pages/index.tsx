import Container from '../components/Container';
import Head from 'next/head';
import Link from 'next/link';
import { APP_NAME, APP_NAME_URL } from '../constants';

export default function Dashboard() {
  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>{APP_NAME_URL}</title>
        <meta name="description" content={APP_NAME} />
      </Head>

      <PageLink linkHref="/deposit" linkText="Deposit" />
      <PageLink linkHref="/sandbox" linkText="Sandbox" />
      <PageLink linkHref="/exp" linkText="Experiments" />
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
