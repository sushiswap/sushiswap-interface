import Card from "../components/Card";
import Head from "next/head";
import Image from "next/image";
import Layout from "../layouts/DefaultLayout";
import Link from "next/link";
import React from "react";
import Web3Status from "../components/Web3Status";
import { t } from "@lingui/macro";
import { useActiveWeb3React } from "../hooks/useActiveWeb3React";
import { useLingui } from "@lingui/react";

export default function BenotBox() {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();
  return (
    <Layout>
      <Head>
        <title>BentoBox | Sushi</title>
        <meta
          name="description"
          content="BentoBox is a token vault that generates yield for liquidity providers. BentoBox creates a source of liquidity that any user can access with minimal approvals, minimal gas usage, and maximal capital efficiency."
        />
      </Head>
      <div
        className="absolute top-0 left-0 right-0"
        style={{ maxHeight: 700, zIndex: -1 }}
      >
        <Image
          className="opacity-50"
          src="/bentobox-hero.jpg"
          alt="BentoBox Hero"
          objectFit="contain"
          objectPosition="top"
          layout="responsive"
          width="auto"
          height="100%"
        />
      </div>
      <div className="text-center">
        <Image
          src="/bentobox-logo.png"
          alt="BentoBox Logo"
          className="object-scale-down h-auto m-w-40 md:m-w-60"
          width="100%"
          height="auto"
        />

        <div className="container max-w-5xl mx-auto">
          <div className="text-3xl font-bold md:text-5xl text-high-emphesis">
            {i18n._(t`BentoBox Apps`)}
          </div>
          <div className="p-4 mt-0 mb-8 text-base font-medium md:text-lg lg:text-xltext-high-emphesis md:mt-4">
            {i18n._(
              t`BentoBox is an innovative way to use dapps gas-efficiently and gain extra yield.`
            )}
          </div>
        </div>

        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-4 gap-4 sm:gap-12 grid-flow-auto">
            <Card className="w-full col-span-2 rounded cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-pink-glow hover:shadow-pink-glow-hovered">
              <div className="relative w-full">
                <Image
                  src="/kashi-neon.png"
                  alt="Kashi Logo"
                  className="mb-4"
                  objectFit="scale-down"
                  width="100%"
                  height="auto"
                />
                {account ? (
                  <Link href="/borrow">
                    <div className="w-full px-4 py-2 text-center bg-transparent border border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-900">
                      {i18n._(t`Enter`)}
                    </div>
                  </Link>
                ) : (
                  <Web3Status />
                )}
              </div>
            </Card>
            <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-blue-glow hover:shadow-blue-glow-hovered">
              <Image
                src="/coming-soon.png"
                alt="Coming Soon"
                className="mb-4"
                objectFit="scale-down"
                width="100%"
                height="auto"
              />
            </Card>
            <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-pink-glow hover:shadow-pink-glow-hovered">
              <Image
                src="/coming-soon.png"
                alt="Coming Soon"
                className="mb-4"
                objectFit="scale-down"
                width="100%"
                height="auto"
              />
            </Card>
            <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-blue-glow hover:shadow-blue-glow-hovered">
              <Image
                src="/coming-soon.png"
                alt="Coming Soon"
                className="mb-4"
                objectFit="scale-down"
                width="100%"
                height="auto"
              />
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
