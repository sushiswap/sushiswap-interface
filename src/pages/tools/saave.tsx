import Container from "../../components/Container";
import Head from "next/head";
import Layout from "../../layouts/DefaultLayout";
import Typography from "../../components/Typography";

export default function Saave() {
  return (
    <Layout>
      <Head>
        <title>Saave | Sushi</title>
        <meta name="description" content="SushiSwap Saave..." />
      </Head>

      <Container className="text-center">
        <Typography component="h1" variant="h1" className="mb-4">
          Saave
        </Typography>
        <Typography variant="lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          iaculis cursus nunc. Pellentesque aliquam, mi sed rhoncus cursus,
          turpis lectus vehicula enim, eu volutpat diam quam at felis.
        </Typography>
      </Container>
    </Layout>
  );
}
