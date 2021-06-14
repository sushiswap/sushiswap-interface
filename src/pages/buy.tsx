import { ChainId } from "@sushiswap/sdk";
import Head from "next/head";
import Layout from "../layouts/DefaultLayout";
import transakSDK from "@transak/transak-sdk";
import { useActiveWeb3React } from "../hooks";
import { useEffect } from "react";

const DEFAULT_NETWORK = {
  [ChainId.MAINNET]: "ethereum",
  [ChainId.BSC]: "bsc",
  [ChainId.MATIC]: "matic",
};

const DEFAULT_CRYPTO_CURRENCY = {
  [ChainId.MAINNET]: "ETH",
  [ChainId.BSC]: "BNB",
  [ChainId.MATIC]: "MATIC",
};

export default function Buy() {
  const { account, chainId } = useActiveWeb3React();
  useEffect(() => {
    if (!(chainId in DEFAULT_NETWORK)) {
      return;
    }
    console.log({ chainId });

    const transak = new transakSDK({
      apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY, // Your API Key
      environment: process.env.NEXT_PUBLIC_TRANSAK_ENVIRONMENT, // STAGING/PRODUCTION
      walletAddress: account,
      fiatCurrency: "", // INR/GBP
      // email: '', // Your customer's email address
      redirectURL: "",
      hostURL: window.location.origin,
      themeColor: "#0D0415",
      widgetHeight: "680px",
      widgetWidth: "100%",
      defaultNetwork: DEFAULT_NETWORK[chainId],
      defaultCryptoCurrency: DEFAULT_CRYPTO_CURRENCY[chainId],
    });

    transak.init();

    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log("ALL_EVENTS", data);
    });

    // This will trigger when the user closed the widget
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      console.log("TRANSAK_WIDGET_CLOSE", orderData);
      transak.close();
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log("TRANSAK_ORDER_SUCCESSFUL", orderData);
      transak.close();
    });
  }, []);
  return (
    <Layout>
      <Head>
        <title>Buy | Sushi</title>
        <meta name="description" content="Buy..." />
      </Head>

      {/* <iframe
                height="600"
                title="Transak On/Off Ramp Widget (Website)"
                src={`https://staging-global.transak.com?apiKey=${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}`}
                frameBorder="no"
                allowTransparency
                allowFullScreen
                style={{
                    width: '100%',
                    maxWidth: '450px',
                }}
                className="h-full"
            ></iframe> */}
    </Layout>
  );
}
