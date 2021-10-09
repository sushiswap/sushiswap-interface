import { ChainId } from '@sushiswap/sdk';
import { ethers } from 'ethers';
import { useActiveWeb3React } from '.';
import { CHAINLINK_USD_PRICE_FEED_MAP, SILO_CHAINLINK_ORACLE, UNI_V2_PRICE_FEED_MAP } from '../constants';
import { SupportedChainId } from '../constants/chains';

type OracleInfo = {
  oraclePriceFeed: string;
  assetOracle: string;
  oracleData: string;
};

const useTokenToPriceFeedLookup = () => {
  const { chainId } = useActiveWeb3React();

  const lookUpChainLinkPriceFeed = (tokenAddress: string) => {
    return CHAINLINK_USD_PRICE_FEED_MAP[chainId][tokenAddress];
  };

  const lookUpUniPriceFeed = (tokenAddress: string) => {
    return UNI_V2_PRICE_FEED_MAP[chainId][tokenAddress];
  };

  const tokenOracleData = (tokenAddress: string) => {
    let oracleInfo: OracleInfo = null;

    const chainLinkPriceFeed = lookUpChainLinkPriceFeed(tokenAddress);
    const uniPriceFeed = lookUpUniPriceFeed(tokenAddress);

    if (chainLinkPriceFeed) {
      console.log('price feed lokup found:', chainLinkPriceFeed);
      oracleInfo = {
        assetOracle: SILO_CHAINLINK_ORACLE[chainId],
        oraclePriceFeed: chainLinkPriceFeed,
        oracleData: ethers.utils.defaultAbiCoder.encode(['address'], [chainLinkPriceFeed]),
      };
    } else {
      oracleInfo = {
        assetOracle: SILO_CHAINLINK_ORACLE[chainId],
        oraclePriceFeed: uniPriceFeed,
        oracleData: ethers.constants.AddressZero,
      };
    }

    return oracleInfo;
  };
  return { tokenOracleData };
};

export default useTokenToPriceFeedLookup;
