import { ChainId } from '@sushiswap/sdk'
import MAINNET from './mainnet'

export type ChainlinkToken = {
    symbol: string
    name: string
    address: string
    decimals: number
}

export const CHAINLINK_TOKENS: { [chainId in ChainId]?: ChainlinkToken[] } = {
    [ChainId.MAINNET]: MAINNET,
    [ChainId.KOVAN]: [
        {
            symbol: 'WETH',
            name: 'Wrapped Ether',
            address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
            decimals: 18,
        },
        {
            symbol: 'ZRX',
            name: '0x Protocol Token',
            address: '0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3',
            decimals: 18,
        },
        {
            symbol: 'USDC',
            name: 'USD Coin USDC',
            address: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
            decimals: 6,
        },
        {
            symbol: 'DAI',
            name: 'Dai Stablecoin',
            address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
            decimals: 18,
        },
        {
            symbol: 'USDT',
            name: 'Tether USD',
            address: '0x07de306FF27a2B630B1141956844eB1552B956B5',
            decimals: 6,
        },
        {
            symbol: 'COMP',
            name: 'Compound',
            address: '0x61460874a7196d6a22D1eE4922473664b3E95270',
            decimals: 18,
        },
        {
            symbol: 'BAT',
            name: 'Basic Attention Token',
            address: '0x482dC9bB08111CB875109B075A40881E48aE02Cd',
            decimals: 18,
        },
        {
            symbol: 'WBTC',
            name: 'Wrapped BTC',
            address: '0xd3A691C852CDB01E281545A27064741F0B7f6825',
            decimals: 8,
        },
        {
            symbol: 'REP',
            name: 'Reputation',
            address: '0x50DD65531676F718B018De3dc48F92B53D756996',
            decimals: 18,
        },
    ],
    [ChainId.BSC]: [
        {
            symbol: 'ADA',
            name: 'Cardano Token',
            address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
            decimals: 18,
        },
        {
            symbol: 'BUSD',
            name: 'BUSD Token',
            address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
            decimals: 18,
        },
        {
            symbol: 'BAND',
            name: 'Band Protocol Token',
            address: '0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18',
            decimals: 18,
        },
        {
            symbol: 'BCH',
            name: 'Bitcoin Cash Token',
            address: '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf',
            decimals: 18,
        },
        {
            symbol: 'BTCB',
            name: 'BTCB Token',
            address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
            decimals: 18,
        },
        {
            symbol: 'BUSD-T',
            name: 'BUSD-T',
            address: '0x55d398326f99059fF775485246999027B3197955',
            decimals: 18,
        },
        {
            symbol: 'CREAM',
            name: 'Cream',
            address: '0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888',
            decimals: 18,
        },
        {
            symbol: 'DAI',
            name: 'Dai Token',
            address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
            decimals: 18,
        },
        {
            symbol: 'DOT',
            name: 'Polkadot Token',
            address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
            decimals: 18,
        },
        {
            symbol: 'EOS',
            name: 'EOS Token',
            address: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6',
            decimals: 18,
        },
        {
            symbol: 'LINK',
            name: 'ChainLink Token',
            address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
            decimals: 18,
        },
        {
            symbol: 'LTC',
            name: 'Litecoin Token',
            address: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94',
            decimals: 18,
        },
        {
            symbol: 'SXP',
            name: 'Swipe',
            address: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
            decimals: 18,
        },
        {
            symbol: 'UNI',
            name: 'Uniswap',
            address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
            decimals: 18,
        },
        {
            symbol: 'USDC',
            name: 'USD Coin',
            address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            decimals: 18,
        },
        {
            symbol: 'XRP',
            name: 'XRP Token',
            address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
            decimals: 18,
        },
        {
            symbol: 'XTZ',
            name: 'Tezos Token',
            address: '0x16939ef78684453bfDFb47825F8a5F714f12623a',
            decimals: 18,
        },
        {
            symbol: 'XVS',
            name: 'Venus',
            address: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63',
            decimals: 18,
        },
        {
            symbol: 'YFI',
            name: 'yearn.finance',
            address: '0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e',
            decimals: 18,
        },
        {
            symbol: 'WBNB',
            name: 'Wrapped BNB',
            address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
        },
        {
            symbol: 'WETH',
            name: 'Wrapped Ether',
            address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            decimals: 18,
        },
        {
            symbol: 'COIN',
            name: 'coin_artist',
            address: '0x87b008E57F640D94Ee44Fd893F0323AF933F9195',
            decimals: 18,
        },
        {
            symbol: 'RAMP',
            name: 'RAMP DEFI',
            address: '0x8519EA49c997f50cefFa444d240fB655e89248Aa',
            decimals: 18,
        },
        {
            symbol: 'VAI',
            name: 'VAI Stablecoin',
            address: '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7',
            decimals: 18,
        },
        {
            symbol: 'ONT',
            name: 'Binance-Peg Ontology Token',
            address: '0xFd7B3A77848f1C2D67E05E54d78d174a0C850335',
            decimals: 18,
        },
        {
            symbol: 'FIL',
            name: 'Binance-Peg Filecoin',
            address: '0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153',
            decimals: 18,
        },
        {
            symbol: 'DOGE',
            name: 'Binance-Peg Dogecoin',
            address: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
            decimals: 8,
        },
        {
            symbol: 'ICE',
            name: 'IceToken',
            address: '0xf16e81dce15B08F326220742020379B855B87DF9',
            decimals: 18,
        },
        {
            symbol: 'EOS',
            name: 'Binance-Peg EOS Token',
            address: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6',
            decimals: 18,
        },
        {
            symbol: 'XTZ',
            name: 'Binance-Peg Tezos Token',
            address: '0x16939ef78684453bfDFb47825F8a5F714f12623a',
            decimals: 18,
        },
        {
            symbol: 'CAKE',
            name: 'PancakeSwap Token',
            address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
            decimals: 18,
        },
    ],
    [ChainId.HECO]: [
        {
            symbol: 'AAVE',
            name: 'AAVE Token',
            address: '0x202b4936fE1a82A4965220860aE46d7d3939Bb25',
            decimals: 18,
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            address: '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD',
            decimals: 18,
        },
        {
            symbol: 'HBCH',
            name: 'HBCH Token',
            address: '0xeF3CEBD77E0C52cb6f60875d9306397B5Caca375',
            decimals: 18,
        },
        {
            symbol: 'HBTC',
            name: 'HBTC Token',
            address: '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa',
            decimals: 18,
        },
        {
            symbol: 'HDOT',
            name: 'HDOT Token',
            address: '0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3',
            decimals: 18,
        },
        {
            symbol: 'HT',
            name: 'Huobi Token',
            address: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F',
            decimals: 18,
        },
        {
            symbol: 'HUSD',
            name: 'HUSD Token',
            address: '0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047',
            decimals: 18,
        },
        {
            symbol: 'HLTC',
            name: 'HLTC Token',
            address: '0xecb56cf772B5c9A6907FB7d32387Da2fCbfB63b4',
            decimals: 18,
        },
        {
            symbol: 'MDX',
            name: 'MDX Token',
            address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
            decimals: 18,
        },
        {
            symbol: 'SNX',
            name: 'SNX Token',
            address: '0x777850281719d5a96C29812ab72f822E0e09F3Da',
            decimals: 18,
        },
        {
            symbol: 'UNI',
            name: 'UNI Token',
            address: '0x22C54cE8321A4015740eE1109D9cBc25815C46E6',
            decimals: 18,
        },
        {
            symbol: 'USDTHECO',
            name: 'USDTHECO Token',
            address: '0xa71EdC38d189767582C38A3145b5873052c3e47a',
            decimals: 18,
        },
    ],
    [ChainId.MATIC]: [
        {
            symbol: 'AAVE',
            name: 'AAVE Token',
            address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
            decimals: 18,
        },
        {
            symbol: 'DAI',
            name: 'Dai Stablecoin',
            address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            decimals: 18,
        },
        {
            symbol: 'WETH',
            name: 'Wrapped Ethereum',
            address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
        },
        {
            symbol: 'WMATIC',
            name: 'Wrapped Matic',
            address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
            decimals: 18,
        },

        {
            symbol: 'USDC',
            name: 'USD Coin',
            address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            decimals: 6,
        },
        {
            symbol: 'USDT',
            name: 'Tether USD',
            address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            decimals: 6,
        },

        {
            symbol: 'WBTC',
            name: 'Wrapped Bitcoin',
            address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
            decimals: 8,
        },
    ],
}
