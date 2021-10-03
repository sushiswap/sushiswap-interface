import { request, GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';
import { useActiveWeb3React } from '../hooks';
import { useSiloFactoryContract } from '../hooks/useContract';

export const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/9379/silo/0.7';

const client = new GraphQLClient(GRAPH_ENDPOINT);

const siloMarketsQuery = `
{
  silos{
    id
    name
    address
    bridgeAssetName
    bridgeAssetAddr
    marketSize
    totalBorrowed
    depositApy
    borrowApy
    oracle
    borrowed
    available
  }
}
`;

type SiloMarket = {
  name: string;
  address: string;
  bridgeAssetName: string;
  bridgeAssetAddr: string;
};

/**
 * TODO:  invalidate react-query markets cache
 */

const useSiloMarkets = () => {
  const { chainId, account } = useActiveWeb3React();
  const siloFactoryContract = useSiloFactoryContract(true);

  const { isLoading, isError, data, error } = useQuery('siloMarketData', async () => {
    return await client.request(siloMarketsQuery);
  });

  const createSiloMarket = async (marketName: string, address: string) => {
    console.log('createMarket() -> on chain:, marketName:', chainId, marketName);

    if (marketName) return await siloFactoryContract.addMarket(address, marketName);
  };

  const removeSiloMarket = async (address: string) => {
    if (address) return await siloFactoryContract.removeMarket(address);
  };

  return {
    siloMarkets: data,
    createSiloMarket,
    removeSiloMarket,
  };
};

export default useSiloMarkets;
