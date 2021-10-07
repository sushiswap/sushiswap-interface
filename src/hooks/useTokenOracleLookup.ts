import { ChainId } from '@sushiswap/sdk';
import { ethers } from 'ethers';
import { useActiveWeb3React } from '.';
import { PRICE_FEED_MAP, SILO_CHAINLINK_ORACLE } from '../constants';
import { SupportedChainId } from '../constants/chains';

type OracleInfo = {
  oraclePriceFeed: string;
  assetOracle: string;
  oracleData: string;
};

const useTokenToPriceFeedLookup = () => {
  const { chainId } = useActiveWeb3React();

  const lookUpPriceFeed = (tokenAddress: string) => {
    return PRICE_FEED_MAP[chainId][tokenAddress];
  };

  const tokenOracleData = (tokenAddress: string) => {
    let oracleInfo: OracleInfo = null;

    const priceFeed = lookUpPriceFeed(tokenAddress);

    if (priceFeed) {
      console.log('price feed lokup found:', priceFeed);
      oracleInfo = {
        assetOracle: SILO_CHAINLINK_ORACLE[chainId],
        oraclePriceFeed: priceFeed,
        oracleData: ethers.utils.defaultAbiCoder.encode(['address'], [priceFeed]),
      };
    }
    return oracleInfo;
  };
  return { tokenOracleData };
};

export default useTokenToPriceFeedLookup;
