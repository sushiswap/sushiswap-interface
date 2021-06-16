import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import Head from "next/head";
import Layout from "../../layouts/DefaultLayout";
import NavLink from "../../components/NavLink";
import Search from "../../components/Search";
import Typography from "../../components/Typography";

export default function Pairs() {
  return (
    <Layout>
      <Head>
        <title>SLP (Sushi Liquidity Pair) Analytics | Sushi</title>
        <meta
          name="description"
          content="SLP (Sushi Liquidity Pair) Analytics by Sushi"
        />
      </Head>
      <Typography variant="h2" component="h1" className="text-high-emphesis">
        Pairs
      </Typography>

      <NavLink>All</NavLink>
    </Layout>
  );
}
