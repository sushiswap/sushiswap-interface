import React, { useState } from 'react';
import Container from '../../components/Container';
import { APP_NAME_URL, APP_SHORT_BLURB } from '../../constants';
import Head from 'next/head';
import Button from '../../components/Button';
import { useActiveWeb3React } from '../../hooks';
import { useNewMarketModalToggle } from '../../state/application/hooks';
import NewMarketModal from '../../modals/NewMarketModal';
import useSiloMarkets from '../../hooks/useSiloMarkets';
import { useTransactionAdder } from '../../state/transactions/hooks';

/**
 *
 * !!! Graph on Chain Id (Kovan | Matic Mainnet)
 */
// graph url
// https://api.studio.thegraph.com/query/9379/silo/0.9

/*** TOD0:
 *
 *     7) refactor into seperate hook for graph related
 *     1) wallet connected?
 *     2) abi stripping (just input array) for useContract abi.map error
 *     3) typechain import
 *     4) gas estimation (on matic?)
 *     5) market data fetch (by chainid?)
 *     6) externalize endpoint
 *     7) search assets (not "Markets")
 *     8) busy state for while in transaction
 *
 */

export default function Markets() {
  const { createSiloMarket, siloMarkets } = useSiloMarkets();
  const toggleNewMarketModal = useNewMarketModalToggle();
  const { account, chainId } = useActiveWeb3React();

  console.log('siloMarkets:', siloMarkets);

  return (
    <>
      <Container id="supply-page" maxWidth="3xl" className="pt-12 md:pt-14 lg:pt-16">
        <Head>
          <title>{APP_NAME_URL}</title>
          <meta key="description" name="description" content={APP_SHORT_BLURB} />
        </Head>
        <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary flex justify-between">
          <h1 className="text-lg font-semibold p-2.5">Markets</h1>
          <div>
            {account ? (
              <Button
                color="gradient"
                className="text-gray-900 font-semibold"
                onClick={() => {
                  console.log('createMarket.click()');
                  // await createSiloMarket();
                  toggleNewMarketModal();
                }}
              >
                Create New Silo Market
              </Button>
            ) : (
              <p> </p>
            )}
          </div>
        </div>
      </Container>

      <NewMarketModal />
      <MarketData markets={siloMarkets} />
    </>
  );
}

const MarketData = ({ markets }) => {
  console.log('markets', markets);

  if (!markets || (markets && markets.silos.length < 1)) {
    return (
      <Container id="markets" maxWidth="3xl" className="pt-4 md:pt-6 lg:pt-8">
        <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary text-high-emphesis">
          No Markets. Click button above to create one.
        </div>
      </Container>
    );
  }

  const MD_STYLE = 'font-semibold text-xs sm:text-sm md:text-base';

  return (
    <>
      <Container id="markets" maxWidth="3xl" className="pt-2 md:pt-4 lg:pt-6">
        <div className="p-4 rounded-lg shadow-lg bg-dark-900 text-secondary">
          <div className="grid grid-cols-6 gap-2">
            <div className={MD_STYLE}>Asset</div>
            <div className={MD_STYLE}>Bridge Asset</div>
            <div className={MD_STYLE}>Market Size</div>
            <div className={MD_STYLE}>Total Borrowed</div>
            <div className={MD_STYLE}>Deposit APY</div>
            <div className={MD_STYLE}>Borrow APY</div>
          </div>
        </div>
      </Container>

      <Container id="markets" maxWidth="3xl">
        {markets && markets.silos.map((m) => <Market key={m.address} market={m} />)}
      </Container>
    </>
  );
};

const Market = ({ market }) => {
  const { removeSiloMarket } = useSiloMarkets();
  const addTransaction = useTransactionAdder();

  console.log('market', market);

  const M_STYLE = 'text-xs sm:text-sm md:text-base text-high-emphesis';

  return (
    <div className="mt-4 p-4 rounded-lg shadow-lg bg-dark-800 text-secondary">
      <div className="grid grid-cols-6 gap-2">
        <div className={M_STYLE}>{market.symbol}</div>
        <div className={M_STYLE}>ETH</div>
        <div className={M_STYLE}>n/a</div>
        <div className={M_STYLE}>n/a</div>
        <div className={M_STYLE}>n/a</div>
        <div className={M_STYLE}>
          <div className="flex justify-between">
            <div>n/a</div>

            <div className="text-dark-900">
              <button
                className="hover:text-red"
                onClick={async (evt) => {
                  evt.preventDefault();
                  console.log('deleting market:', market.address);
                  const result = await removeSiloMarket(market.address);
                  addTransaction(result, {
                    summary: `Removed silo market ${market.name}`,
                  });
                }}
              >
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
