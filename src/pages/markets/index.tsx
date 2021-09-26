import React, { useState } from 'react';
import Container from '../../components/Container';
import { APP_NAME_URL, APP_SHORT_BLURB } from '../../constants';
import Head from 'next/head';
import Button from '../../components/Button';
import { useActiveWeb3React } from '../../hooks';
import { useSiloFactoryContract } from '../../hooks/useContract';

/**
 *
 * !!! Graph on Chain Id (Rinkeby | Matic Mainnet)
 */
// graph url
// https://api.studio.thegraph.com/query/9379/silo/0.3

/*** TOD0:
 *     0) delete market event
 *     1) wallet connected?
 *     2) abi stripping (just input array) for useContract abi.map error
 *     3) typechain import
 *     4) gas estimation (on matic?)
 */

type SilomMarket = {
  name: string;
  address: string;
};

const useSiloMarkets = () => {
  const { chainId, account } = useActiveWeb3React();
  const siloFactoryContract = useSiloFactoryContract(true);

  const createSiloMarket = async () => {
    console.log('on chain:', chainId);
    await siloFactoryContract.addMarket(account, 'FirstMarket');
  };

  //  const removeSiloMarket = async() => {}

  return { createSiloMarket };
};

export default function Markets() {
  const { createSiloMarket } = useSiloMarkets();

  return (
    <Container id="supply-page" className="py-12 md:py-14 lg:py-16">
      <Head>
        <title>{APP_NAME_URL}</title>
        <meta key="description" name="description" content={APP_SHORT_BLURB} />
      </Head>
      <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary flex justify-between">
        <h1 className="text-lg font-semibold p-2.5">Markets</h1>
        <div>
          <Button
            color="gradient"
            className="text-gray-900 font-semibold"
            onClick={async () => {
              console.log('createMarket.click()');
              await createSiloMarket();
            }}
          >
            Create New Silo Market
          </Button>
        </div>
      </div>
    </Container>
  );
}
