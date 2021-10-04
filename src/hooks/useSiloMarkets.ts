import { CHAINLINK_ORACLE_ADDRESS } from '@sushiswap/sdk';
import { ethers } from 'ethers';
import { request, GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';
import { useActiveWeb3React } from '../hooks';
import { useSiloFactoryContract } from '../hooks/useContract';
import useTokenOracleLookup from './useTokenOracleLookup';

export const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/9379/silo/0.9';

const client = new GraphQLClient(GRAPH_ENDPOINT);

const siloMarketsQuery = `
{
  silos{
    id
    name
    address
    symbol
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
  const { tokenOracleData } = useTokenOracleLookup();

  const { isLoading, isError, data, error } = useQuery('siloMarketData', async () => {
    return await client.request(siloMarketsQuery);
  });

  // const asset = LINK_ADDRESS;
  // const assetOracle = (await deployments.get('ChainlinkOracle')).address;
  // const oracleData = ethers.utils.defaultAbiCoder.encode(["address"], [LINK_PRICEFEED]);
  // let tx = await siloFactory.newSilo(asset, assetOracle, oracleData);

  const createSiloMarket = async (assetAddress: string) => {
    console.log('createMarket() -> assetAddress:', assetAddress);

    if (assetAddress) {
      //TODO: dynamically lookup oracle price feed

      const oracleInfo = tokenOracleData(assetAddress.toLowerCase());

      console.log('oracleData:', oracleInfo);

      const result = await siloFactoryContract.newSilo(assetAddress, oracleInfo.assetOracle, oracleInfo.oracleData);

      return result;
    }
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
