import { CHAINLINK_ORACLE_ADDRESS } from '@sushiswap/sdk';
import { ethers } from 'ethers';
import { request, GraphQLClient } from 'graphql-request';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { GRAPH_ENDPOINT } from '../constants';
import { useActiveWeb3React } from '../hooks';
import { useSiloFactoryContract } from '../hooks/useContract';
import useTokenOracleLookup from './useTokenOracleLookup';

const siloMarketsQuery = `
{
  silos{
    id
    name
    address
    assetAddress
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

export type SiloMarket = {
  id: string;
  name: string;
  address: string;
  assetAddress: string;
  symbol: string;
  bridgeAssetName: string;
  bridgeAssetAddr: string;
  marketSize: string;
  totalBorrowed: string;
  depositApy: string;
  borrowApy: string;
  oracle: string;
  borrowed: string;
  available: string;
};

/**
 * TODO:  invalidate react-query markets cache
 */

const useSiloMarkets = () => {
  const [currentSilo, setCurrentSilo] = useState<SiloMarket | null>(null);
  const [currentOutSilo, setCurrentOutSilo] = useState<SiloMarket | null>(null);
  const { chainId, account } = useActiveWeb3React();
  const siloFactoryContract = useSiloFactoryContract(true);
  const { tokenOracleData } = useTokenOracleLookup();

  const { isLoading, isError, data, error } = useQuery('siloMarketData', async () => {
    const client = new GraphQLClient(GRAPH_ENDPOINT[chainId]);
    return await client.request(siloMarketsQuery);
  });

  //TODO: dynamically lookup oracle price feed
  const createSiloMarket = async (assetAddress: string) => {
    console.log('createMarket() -> assetAddress:', assetAddress);

    if (assetAddress) {
      const oracleInfo = tokenOracleData(assetAddress.toLowerCase());
      console.log('oracleData:', oracleInfo);
      const result = await siloFactoryContract.newSilo(assetAddress, oracleInfo.assetOracle, oracleInfo.oracleData);
      return result;
    }
  };

  const removeSiloMarket = async (address: string) => {
    if (address) return await siloFactoryContract.removeMarket(address);
  };

  // setCurrentSilo(silo);
  // tokenInSilo (address, isOutSilo=false)
  const tokenInSilo = (tokenAddress: string, isOutSilo: boolean = false): boolean => {
    // console.log('markets:', data);
    let isIn = false;

    data.silos.forEach((silo) => {
      if (silo.assetAddress.toLowerCase() === tokenAddress.toLowerCase()) {
        isIn = true;

        // if is OutSilo setCurrentOutSilo
        if (isOutSilo) {
          setCurrentOutSilo(silo);
        } else {
          setCurrentSilo(silo);
        }
        return;
      }
    });

    return isIn;
  };

  const deposit = () => {};

  return {
    siloMarkets: data,
    createSiloMarket,
    removeSiloMarket,
    tokenInSilo,
    deposit,
    currentSilo,
    currentOutSilo,
  };
};

export default useSiloMarkets;
