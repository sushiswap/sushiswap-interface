import { ChainId } from '@sushiswap/sdk'

// Multichain Explorer
const builders = {
    etherscan: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = `https://${chainName ? `${chainName}.` : ''}etherscan.io`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    fantom: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = 'https://ftmscan.com'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    xdai: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = `https://blockscout.com/poa/xdai`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'token':
                return `${prefix}/tokens/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    bscscan: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = `https://${chainName ? `${chainName}.` : ''}bscscan.com`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    matic: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        // const prefix = `https://explorer-${chainName}.maticvigil.com`
        const prefix = 'https://polygonscan.com'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'token':
                return `${prefix}/tokens/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    // token is not yet supported for arbitrum
    arbitrum: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = `https://mainnet-arb-explorer.netlify.app`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    // token is not yet supported for arbitrum
    arbitrumTestnet: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = `https://explorer.offchainlabs.com/#`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'token':
                return prefix
            default:
                return `${prefix}/${type}/${data}`
        }
    },
    moonbase: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = 'https://moonbeam-explorer.netlify.app'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'address':
                return `${prefix}/address/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    avalanche: (
        chainName: string,
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = `https://cchain.explorer.avax${
            chainName ? `-${chainName}` : ''
        }.network`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    heco: (
        chainName = '',
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = `https://${chainName ? `${chainName}.` : ''}hecoinfo.com`
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    harmony: (
        chainName = '',
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = 'https://explorer.harmony.one/#'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },

    harmonyTestnet: (
        chainName = '',
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = 'https://explorer.pops.one/#'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },
    okex: (
        chainName = '',
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = 'https://www.oklink.com/okexchain'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'token':
                return `${prefix}/tokenAddr/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },
    okexTestnet: (
        chainName = '',
        data: string,
        type: 'transaction' | 'token' | 'address' | 'block'
    ) => {
        const prefix = 'https://www.oklink.com/okexchain-test'
        switch (type) {
            case 'transaction':
                return `${prefix}/tx/${data}`
            case 'token':
                return `${prefix}/tokenAddr/${data}`
            default:
                return `${prefix}/${type}/${data}`
        }
    },
}

interface ChainObject {
    [chainId: number]: {
        chainName: string
        builder: (
            chainName: string,
            data: string,
            type: 'transaction' | 'token' | 'address' | 'block'
        ) => string
    }
}

const chains: ChainObject = {
    [ChainId.MAINNET]: {
        chainName: '',
        builder: builders.etherscan,
    },
    [ChainId.ROPSTEN]: {
        chainName: 'ropsten',
        builder: builders.etherscan,
    },
    [ChainId.RINKEBY]: {
        chainName: 'rinkeby',
        builder: builders.etherscan,
    },
    [ChainId.GÖRLI]: {
        chainName: 'goerli',
        builder: builders.etherscan,
    },
    [ChainId.KOVAN]: {
        chainName: 'kovan',
        builder: builders.etherscan,
    },
    [ChainId.MATIC]: {
        chainName: 'mainnet',
        builder: builders.matic,
    },
    [ChainId.MATIC_TESTNET]: {
        chainName: 'mumbai',
        builder: builders.matic,
    },
    [ChainId.FANTOM]: {
        chainName: '',
        builder: builders.fantom,
    },
    [ChainId.FANTOM_TESTNET]: {
        chainName: 'testnet',
        builder: builders.fantom,
    },
    [ChainId.XDAI]: {
        chainName: 'xdai',
        builder: builders.xdai,
    },
    [ChainId.BSC]: {
        chainName: '',
        builder: builders.bscscan,
    },
    [ChainId.BSC_TESTNET]: {
        chainName: 'testnet',
        builder: builders.bscscan,
    },
    [ChainId.ARBITRUM]: {
        chainName: '',
        builder: builders.arbitrum,
    },
    [ChainId.ARBITRUM_TESTNET]: {
        chainName: 'arbitrum',
        builder: builders.arbitrumTestnet,
    },
    [ChainId.MOONBEAM_TESTNET]: {
        chainName: '',
        builder: builders.moonbase,
    },
    [ChainId.AVALANCHE]: {
        chainName: '',
        builder: builders.avalanche,
    },
    [ChainId.AVALANCHE_TESTNET]: {
        chainName: 'test',
        builder: builders.avalanche,
    },
    [ChainId.HECO]: {
        chainName: '',
        builder: builders.heco,
    },
    [ChainId.HECO_TESTNET]: {
        chainName: 'testnet',
        builder: builders.heco,
    },
    [ChainId.HARMONY]: {
        chainName: '',
        builder: builders.harmony,
    },
    [ChainId.HARMONY_TESTNET]: {
        chainName: '',
        builder: builders.harmonyTestnet,
    },
    [ChainId.OKEX]: {
        chainName: '',
        builder: builders.okex,
    },
    [ChainId.OKEX_TESTNET]: {
        chainName: '',
        builder: builders.okexTestnet,
    },
}

export function getExplorerLink(
    chainId: ChainId,
    data: string,
    type: 'transaction' | 'token' | 'address' | 'block'
): string {
    const chain = chains[chainId]
    return chain.builder(chain.chainName, data, type)
}
