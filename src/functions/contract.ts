// NOTE: Try not to add anything to thie file, it's almost entirely refactored out.

import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@sushiswap/core-sdk'
//import IUniswapV2Router02ABI from 'app/constants/abis/uniswap-v2-router-02.json'
//import OpenMevRouter from 'app/constants/abis/OpenMevRouterV01.json'
import IUniswapV2Router02ABI from 'app/constants/abis/IOpenMevRouterV01.abi.json'
import IUniswapV2Router02NoETHABI from 'app/constants/abis/uniswap-v2-router-02-no-eth.json'
import { isAddress } from 'app/functions/validate'

export declare type AddressMap = {
  [chainId: number]: string;
};

// OpenMevRouterV01 Address 0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F
export declare const ROUTER_ADDRESS: {
  [ChainId.ETHEREUM]: {
    '0x58a9DF4121097760C3B6102e7BeECe1648eC828B': true, // v2 router 02
  },
}

// Non Checksum     '0x58a9df4121097760c3b6102e7beece1648ec828b'
// Checksum         '0x58a9DF4121097760C3B6102e7BeECe1648eC828B'
// 1191 Checksum    '0x58A9DF4121097760C3B6102E7beECE1648EC828b'
/** 
export const ROUTER_ADDRESS: { [chainId: string]: { [address: string]: true } } = {
  [ChainId.ETHEREUM]: {
    '0x58a9DF4121097760C3B6102e7BeECe1648eC828B': true, // v2 router 02
  },
}
 */


// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export function getRouterAddress(chainId?: ChainId) {
  if (!chainId) {
    throw Error(`Undefined 'chainId' parameter '${chainId}'.`)
  }
  // @ts-ignore
  return ROUTER_ADDRESS[chainId]
}

// account is optional
export function getRouterContract(chainId: number, library: Web3Provider, account?: string): Contract {
  return getContract(
    getRouterAddress(chainId),
    chainId !== ChainId.CELO ? IUniswapV2Router02ABI : IUniswapV2Router02NoETHABI,
    library,
    account
  )
}
