import MISO_TOKEN_FACTORY_ABI from './MISOTokenFactory.json'

/* eslint-disable prettier/prettier */
export const tokenFactory = {
	address: {
		1: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD', // main
		3: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD', // ropsten
		4: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD', // rinkeby
		42: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD', // kovan
		5: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD', // goerli
		56: '', // BSC mainnet
		97: '0xc16F721fc5d8E17D99deE8F9758a389F1fb85E91', // BSC testnet
		137: '', // Matic mainnet
		80001: '0x1eC9e6f1aDF139A41B94d2590078103f7b8a09DD', // Matic testnet
	},
	abi: MISO_TOKEN_FACTORY_ABI,
}