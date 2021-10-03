import { CHAINLINK_ORACLE_ADDRESS } from '@sushiswap/sdk';
import { ethers } from 'ethers';
import { request, GraphQLClient } from 'graphql-request';
import { useQuery } from 'react-query';
import { useActiveWeb3React } from '../hooks';
import { useSiloFactoryContract } from '../hooks/useContract';

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

  const { isLoading, isError, data, error } = useQuery('siloMarketData', async () => {
    return await client.request(siloMarketsQuery);
  });

  // const asset = LINK_ADDRESS;
  // const assetOracle = (await deployments.get('ChainlinkOracle')).address;
  // const oracleData = ethers.utils.defaultAbiCoder.encode(["address"], [LINK_PRICEFEED]);
  // let tx = await siloFactory.newSilo(asset, assetOracle, oracleData);

  const createSiloMarket = async (assetAddress: string) => {
    // console.log('createMarket() -> on chain:, marketName:', chainId, marketName);

    if (assetAddress) {
      //TODO: dynamically lookup oracle price feed

      // try{
      const linkAddress = '0xa36085F69e2889c224210F603D836748e7dC0088'; //kovan link
      const LINK_PRICEFEED = '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c'; //LINK/USD (mainnet)
      //const assetOracle = CHAINLINK_ORACLE_ADDRESS;
      const assetOracle = '0xe93232A71Bf453e9f83b8f41D0B6c4409725f0d1'; //silo chainlink oracle contract
      const oracleData = ethers.utils.defaultAbiCoder.encode(['address'], [LINK_PRICEFEED]);

      console.log('link address:', linkAddress);
      console.log('assetOracle:', assetOracle);
      console.log('link pricefeed', LINK_PRICEFEED);
      console.log('oracle data:', oracleData);

      const result = await siloFactoryContract.newSilo(linkAddress, assetOracle, oracleData);
      return result;

      // }catch (error){
      //   console.error(error);
      // }
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
