import { ChainId } from '@sushiswap/sdk';
import { ethers } from 'ethers';
import { useActiveWeb3React } from '.';
import { SILO_CHAINLINK_ORACLE } from '../constants';
import { SupportedChainId } from '../constants/chains';

type OracleInfo = {
  oraclePriceFeed: string;
  assetOracle: string;
  oracleData: string;
};

export const KOVAN_TOKEN_PRICEFEED_MAP: { [key: string]: string } = {
  '0xa36085f69e2889c224210f603d836748e7dc0088': '0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0', //KOVAN LINK-> KOVAN LINK/USD
  // '0x22f1ba6dB6ca0A065e1b7EAe6FC22b7E675310EF': '0xdc3ea94cd0ac27d9a86c180091e7f78c683d3699', //KOVAN SNX -> ''
  // '0xb597cd8d3217ea6477232f9217fa70837ff667af': '0x547a514d5e3769680ce22b2361c10ea13619e8a9', //KOVAN AAVE
  // '0x61460874a7196d6a22d1ee4922473664b3e95270': '0xdbd020caef83efd542f4de03e3cf0c28a4428bd5', //KOVAN COMP
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': '0xDA5904BdBfB4EF12a3955aEcA103F51dc87c7C39', //KOVAN UNI
  // '0xac94ea989f6955c67200dd67f0101e1865a560ea': '0xec1d1b3b0443256cc3860e24a46f108e699484aa', //KOVAN MKR
  // '0x33a368b290589ce8cf781ab4331fe52e77478736': '0xcc70f09a6cc17553b2e31954cd36e4a2d89501f7', //KOVAN SUSHI
};

// const SILO_ASSET_ORACLE = '0xe93232A71Bf453e9f83b8f41D0B6c4409725f0d1'; //silo chainlink oracle contract

const useTokenToPriceFeedLookup = () => {
  const { chainId } = useActiveWeb3React();

  const lookUpPriceFeed = (tokenAddress: string) => {
    // console.log('chain id:', chainId);
    //TODO: by chainId, pickup bigger per chain
    return KOVAN_TOKEN_PRICEFEED_MAP[tokenAddress];
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
