import { ChainId } from '@sushiswap/sdk'

export type ChainlinkToken = {
    symbol: string
    name: string
    address: string
    decimals: number
}

export const CHAINLINK_TOKENS: { [chainId in ChainId]?: ChainlinkToken[] } = {
    [ChainId.MAINNET]: [
        { symbol: '1INCH', name: '1INCH Token', address: '0x111111111117dC0aa78b770fA6A738034120C302', decimals: 18 },
        { symbol: 'AAVE', name: 'Aave Token', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18 },
        { symbol: 'ADX', name: 'AdEx Network', address: '0xADE00C28244d5CE17D72E40330B1c318cD12B7c3', decimals: 18 },
        { symbol: 'AKRO', name: 'Akropolis', address: '0x8Ab7404063Ec4DBcfd4598215992DC3F8EC853d7', decimals: 18 },
        { symbol: 'ALPHA', name: 'AlphaToken', address: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', decimals: 18 },
        { symbol: 'AMP', name: 'Amp', address: '0xfF20817765cB7f73d4bde2e66e067E58D11095C2', decimals: 18 },
        { symbol: 'ANKR', name: 'Ankr Network', address: '0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4', decimals: 18 },
        {
            symbol: 'ANT',
            name: 'Aragon Network Token',
            address: '0xa117000000f279D81A1D3cc75430fAA017FA5A2e',
            decimals: 18
        },
        {
            symbol: 'AUCTION',
            name: 'Bounce Token',
            address: '0xA9B1Eb5908CfC3cdf91F9B8B3a74108598009096',
            decimals: 18
        },
        { symbol: 'BADGER', name: 'Badger', address: '0x3472A5A71965499acd81997a54BBA8D852C6E53d', decimals: 18 },
        { symbol: 'BAL', name: 'Balancer', address: '0xba100000625a3754423978a60c9317c58a424e3D', decimals: 18 },
        { symbol: 'BAND', name: 'BandToken', address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55', decimals: 18 },
        {
            symbol: 'BAT',
            name: 'Basic Attention Token',
            address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
            decimals: 18
        },
        { symbol: 'BNT', name: 'Bancor', address: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C', decimals: 18 },
        { symbol: 'BOR', name: 'BoringDAO', address: '0x3c9d6c1C73b31c837832c72E04D3152f051fc1A9', decimals: 18 },
        { symbol: 'BUSD', name: 'Binance USD', address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53', decimals: 18 },
        {
            symbol: 'BZRX',
            name: 'bZx Protocol Token',
            address: '0x56d811088235F11C8920698a204A5010a788f4b3',
            decimals: 18
        },
        { symbol: 'CEL', name: 'Celsius', address: '0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d', decimals: 4 },
        { symbol: 'COMP', name: 'Compound', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', decimals: 18 },
        {
            symbol: 'COVER',
            name: 'Cover Protocol Governance Token',
            address: '0x4688a8b1F292FDaB17E9a90c8Bc379dC1DBd8713',
            decimals: 18
        },
        { symbol: 'CREAM', name: 'Cream', address: '0x2ba592F78dB6436527729929AAf6c908497cB200', decimals: 18 },
        { symbol: 'CRO', name: 'CRO', address: '0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b', decimals: 8 },
        { symbol: 'CRV', name: 'Curve DAO Token', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', decimals: 18 },
        { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
        { symbol: 'DPI', name: 'DefiPulse Index', address: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b', decimals: 18 },
        { symbol: 'ENJ', name: 'Enjin Coin', address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c', decimals: 18 },
        { symbol: 'ETH', name: 'Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
        {
            symbol: 'FRONT',
            name: 'Frontier Token',
            address: '0xf8C3527CC04340b208C854E985240c02F7B7793f',
            decimals: 18
        },
        { symbol: 'FRX', name: 'Frax Share', address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', decimals: 18 },
        { symbol: 'FTM', name: 'Fantom Token', address: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870', decimals: 18 },
        { symbol: 'FTX Token', name: 'FTT', address: '0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9', decimals: 18 },
        { symbol: 'GRT', name: 'Graph Token', address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7', decimals: 18 },
        { symbol: 'HEGIC', name: 'Hegic', address: '0x584bC13c7D411c00c01A62e8019472dE68768430', decimals: 18 },
        { symbol: 'HUSD', name: 'HUSD', address: '0xdF574c24545E5FfEcb9a659c229253D4111d87e1', decimals: 8 },
        { symbol: 'INJ', name: 'Injective Token', address: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30', decimals: 18 },
        {
            symbol: 'KNC',
            name: 'Kyber Network Crystal',
            address: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
            decimals: 18
        },
        { symbol: 'KP3R', name: 'Keep3rV1', address: '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44', decimals: 18 },
        {
            symbol: 'LINK',
            name: 'ChainLink Token',
            address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            decimals: 18
        },
        { symbol: 'LRC', name: 'LoopringCoin V2', address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD', decimals: 18 },
        {
            symbol: 'MANA',
            name: 'Decentraland MANA',
            address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
            decimals: 18
        },
        { symbol: 'MATIC', name: 'Matic Token', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', decimals: 18 },
        { symbol: 'MKR', name: 'Maker', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18 },
        { symbol: 'MLN', name: 'Melon Token', address: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892', decimals: 18 },
        { symbol: 'MTA', name: 'Meta', address: '0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2', decimals: 18 },
        { symbol: 'NMR', name: 'Numeraire', address: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671', decimals: 18 },
        { symbol: 'OCEAN', name: 'Ocean Token', address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48', decimals: 18 },
        { symbol: 'OGN', name: 'OriginToken', address: '0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26', decimals: 18 },
        { symbol: 'OKB', name: 'OKB', address: '0x75231F58b43240C9718Dd58B4967c5114342a86c', decimals: 18 },
        { symbol: 'OMG', name: 'OMGToken', address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', decimals: 18 },
        { symbol: 'ORN', name: 'Orion Protocol', address: '0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a', decimals: 8 },
        { symbol: 'OXT', name: 'Orchid', address: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb', decimals: 18 },
        { symbol: 'PAX', name: 'Paxos Standard', address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1', decimals: 18 },
        { symbol: 'PAXG', name: 'Paxos Gold', address: '0x45804880De22913dAFE09f4980848ECE6EcbAf78', decimals: 18 },
        { symbol: 'PERP', name: 'Perpetual', address: '0xbC396689893D065F41bc2C6EcbeE5e0085233447', decimals: 18 },
        {
            symbol: 'RAI',
            name: 'Rai Reflex Index',
            address: '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919',
            decimals: 18
        },
        { symbol: 'RARI', name: 'Rarible', address: '0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF', decimals: 18 },
        {
            symbol: 'RCN',
            name: 'Ripio Credit Network Token',
            address: '0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6',
            decimals: 18
        },
        { symbol: 'REN', name: 'Republic Token', address: '0x408e41876cCCDC0F92210600ef50372656052a38', decimals: 18 },
        { symbol: 'REPv2', name: 'Reputation', address: '0x221657776846890989a759BA2973e427DfF5C9bB', decimals: 18 },
        {
            symbol: 'RGT',
            name: 'Rari Governance Token',
            address: '0xD291E7a03283640FDc51b121aC401383A46cC623',
            decimals: 18
        },
        {
            symbol: 'RLC',
            name: 'iEx.ec Network Token',
            address: '0x607F4C5BB672230e8672085532f7e901544a7375',
            decimals: 9
        },
        {
            symbol: 'RUNE',
            name: 'THORChain ETH.RUNE',
            address: '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
            decimals: 18
        },
        { symbol: 'SAND', name: 'SAND', address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0', decimals: 18 },
        {
            symbol: 'SNX',
            name: 'Synthetix Network Token',
            address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
            decimals: 18
        },
        { symbol: 'SRM', name: 'Serum', address: '0x476c5E26a75bd202a9683ffD34359C0CC15be0fF', decimals: 6 },
        { symbol: 'sUSD', name: 'Synth sUSD', address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51', decimals: 18 },
        { symbol: 'SUSHI', name: 'SushiToken', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', decimals: 18 },
        { symbol: 'SXP', name: 'Swipe', address: '0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9', decimals: 18 },
        { symbol: 'TOMOE', name: 'TomoChain', address: '0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa', decimals: 18 },
        { symbol: 'TRU', name: 'TrueFi', address: '0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784', decimals: 8 },
        { symbol: 'TRY', name: 'TRYfinance', address: '0xc12eCeE46ed65D970EE5C899FCC7AE133AfF9b03', decimals: 18 },
        { symbol: 'TUSD', name: 'TrueUSD', address: '0x0000000000085d4780B73119b644AE5ecd22b376', decimals: 18 },
        {
            symbol: 'UMA',
            name: 'UMA Voting Token v1',
            address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
            decimals: 18
        },
        { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18 },
        { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
        { symbol: 'USDK', name: 'USDK', address: '0x1c48f86ae57291F7686349F12601910BD8D470bb', decimals: 18 },
        { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
        {
            symbol: 'UST',
            name: 'Wrapped UST Token',
            address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
            decimals: 18
        },
        { symbol: 'WAVES', name: 'WAVES', address: '0x1cF4592ebfFd730c7dc92c1bdFFDfc3B9EfCf29a', decimals: 18 },
        { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 },
        { symbol: 'wNXM', name: 'Wrapped NXM', address: '0x0d438F3b5175Bebc262bF23753C1E53d03432bDE', decimals: 18 },
        { symbol: 'WOM', name: 'WOM Token', address: '0xBd356a39BFf2cAda8E9248532DD879147221Cf76', decimals: 18 },
        { symbol: 'xSUSHI', name: 'SushiBar', address: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272', decimals: 18 },
        { symbol: 'YFI', name: 'yearn.finance', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', decimals: 18 },
        { symbol: 'YFII', name: 'YFII.finance', address: '0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83', decimals: 18 },
        {
            symbol: 'ZRX',
            name: '0x Protocol Token',
            address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
            decimals: 18
        },
        { symbol: 'HT', name: 'Huobi Token', address: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161', decimals: 18 },
        { symbol: 'RAMP', name: 'RAMP DEFI', address: '0x33D0568941C0C64ff7e0FB4fbA0B11BD37deEd9f', decimals: 18 }
    ],
    [ChainId.KOVAN]: [
        { symbol: 'WETH', name: 'Wrapped Ether', address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C', decimals: 18 },
        {
            symbol: 'ZRX',
            name: '0x Protocol Token',
            address: '0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3',
            decimals: 18
        },
        { symbol: 'USDC', name: 'USD Coin USDC', address: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede', decimals: 6 },
        { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', decimals: 18 },
        { symbol: 'USDT', name: 'Tether USD', address: '0x07de306FF27a2B630B1141956844eB1552B956B5', decimals: 6 },
        { symbol: 'COMP', name: 'Compound', address: '0x61460874a7196d6a22D1eE4922473664b3E95270', decimals: 18 },
        {
            symbol: 'BAT',
            name: 'Basic Attention Token',
            address: '0x482dC9bB08111CB875109B075A40881E48aE02Cd',
            decimals: 18
        },
        { symbol: 'WBTC', name: 'Wrapped BTC', address: '0xd3A691C852CDB01E281545A27064741F0B7f6825', decimals: 8 },
        { symbol: 'REP', name: 'Reputation', address: '0x50DD65531676F718B018De3dc48F92B53D756996', decimals: 18 }
    ],
    [ChainId.BSC]: [
        { symbol: 'ADA', name: 'Cardano Token', address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47', decimals: 18 },
        { symbol: 'BUSD', name: 'BUSD Token', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', decimals: 18 },
        {
            symbol: 'BAND',
            name: 'Band Protocol Token',
            address: '0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18',
            decimals: 18
        },
        {
            symbol: 'BCH',
            name: 'Bitcoin Cash Token',
            address: '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf',
            decimals: 18
        },
        { symbol: 'BTCB', name: 'BTCB Token', address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', decimals: 18 },
        { symbol: 'BUSD-T', name: 'BUSD-T', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
        { symbol: 'CREAM', name: 'Cream', address: '0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888', decimals: 18 },
        { symbol: 'DAI', name: 'Dai Token', address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', decimals: 18 },
        { symbol: 'DOT', name: 'Polkadot Token', address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402', decimals: 18 },
        { symbol: 'EOS', name: 'EOS Token', address: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6', decimals: 18 },
        {
            symbol: 'LINK',
            name: 'ChainLink Token',
            address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
            decimals: 18
        },
        { symbol: 'LTC', name: 'Litecoin Token', address: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94', decimals: 18 },
        { symbol: 'SXP', name: 'Swipe', address: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a', decimals: 18 },
        { symbol: 'UNI', name: 'Uniswap', address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1', decimals: 18 },
        { symbol: 'USDC', name: 'USD Coin', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
        { symbol: 'XRP', name: 'XRP Token', address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE', decimals: 18 },
        { symbol: 'XTZ', name: 'Tezos Token', address: '0x16939ef78684453bfDFb47825F8a5F714f12623a', decimals: 18 },
        { symbol: 'XVS', name: 'Venus', address: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63', decimals: 18 },
        { symbol: 'YFI', name: 'yearn.finance', address: '0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e', decimals: 18 },
        { symbol: 'WBNB', name: 'Wrapped BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', decimals: 18 },
        { symbol: 'WETH', name: 'Wrapped Ether', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18 }
    ],
    [ChainId.HECO]: [
        { symbol: 'AAVE', name: 'AAVE Token', address: '0x202b4936fE1a82A4965220860aE46d7d3939Bb25', decimals: 18 },
        { symbol: 'ETH', name: 'Ethereum', address: '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD', decimals: 18 },
        { symbol: 'HBCH', name: 'HBCH Token', address: '0xeF3CEBD77E0C52cb6f60875d9306397B5Caca375', decimals: 18 },
        { symbol: 'HBTC', name: 'HBTC Token', address: '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa', decimals: 18 },
        { symbol: 'HDOT', name: 'HDOT Token', address: '0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3', decimals: 18 },
        { symbol: 'HT', name: 'Huobi Token', address: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F', decimals: 18 },
        { symbol: 'HUSD', name: 'HUSD Token', address: '0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047', decimals: 18 },
        { symbol: 'HLTC', name: 'HLTC Token', address: '0xecb56cf772B5c9A6907FB7d32387Da2fCbfB63b4', decimals: 18 },
        { symbol: 'MDX', name: 'MDX Token', address: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c', decimals: 18 },
        { symbol: 'SNX', name: 'SNX Token', address: '0x777850281719d5a96C29812ab72f822E0e09F3Da', decimals: 18 },
        { symbol: 'UNI', name: 'UNI Token', address: '0x22C54cE8321A4015740eE1109D9cBc25815C46E6', decimals: 18 },
        {
            symbol: 'USDTHECO',
            name: 'USDTHECO Token',
            address: '0xa71EdC38d189767582C38A3145b5873052c3e47a',
            decimals: 18
        }
    ],
    [ChainId.MATIC]: [
        { symbol: 'AAVE', name: 'AAVE Token', address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', decimals: 18 },
        { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18 },
        {
            symbol: 'WETH',
            name: 'Wrapped Ethereum',
            address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18
        },
        {
            symbol: 'WMATIC',
            name: 'Wrapped Matic',
            address: '0x084666322d3ee89aAbDBBCd084323c9AF705C7f5',
            decimals: 18
        },

        { symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
        { symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },

        { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', decimals: 8 }
    ]
}

export type ChainlinkMappingList = {
    readonly [address: string]: {
        from: string
        to: string
        decimals: number
        fromDecimals: number
        toDecimals: number
        warning?: string
        address?: string
    }
}

export const CHAINLINK_MAPPING: { [chainId in ChainId]?: ChainlinkMappingList } = {
    [ChainId.MAINNET]: {
        '0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8': {
            from: '0x111111111117dC0aa78b770fA6A738034120C302',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xc929ad75B72593967DE83E7F7Cda0493458261D9': {
            from: '0x111111111117dC0aa78b770fA6A738034120C302',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012': {
            from: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9': {
            from: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x231e764B44b2C1b7Ca171fa8021A24ed520Cde10': {
            from: '0xADE00C28244d5CE17D72E40330B1c318cD12B7c3',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xB23D105dF4958B4b81757e12f2151B5b5183520B': {
            from: '0x8Ab7404063Ec4DBcfd4598215992DC3F8EC853d7',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x89c7926c7c15fD5BFDB1edcFf7E7fC8283B578F6': {
            from: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x8797ABc4641dE76342b8acE9C63e3301DC35e3d8': {
            from: '0xfF20817765cB7f73d4bde2e66e067E58D11095C2',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x7eed379bf00005CfeD29feD4009669dE9Bcc21ce': {
            from: '0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x8f83670260F8f7708143b836a2a6F11eF0aBac01': {
            from: '0xa117000000f279D81A1D3cc75430fAA017FA5A2e',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xA6BCac72431A4178f07d016E1D912F56E6D989Ec': {
            from: '0xA9B1Eb5908CfC3cdf91F9B8B3a74108598009096',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x58921Ac140522867bf50b9E009599Da0CA4A2379': {
            from: '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xC1438AA3823A6Ba0C159CfA8D98dF5A994bA120b': {
            from: '0xba100000625a3754423978a60c9317c58a424e3D',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x0BDb051e10c9718d1C29efbad442E88D38958274': {
            from: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x919C77ACc7373D000b329c1276C76586ed2Dd19F': {
            from: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x0d16d4528239e9ee52fa531af613AcdB23D88c94': {
            from: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xCf61d1841B178fe82C8895fe60c2EDDa08314416': {
            from: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x1E6cF0D433de4FE882A437ABC654F58E1e78548c': {
            from: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xf8D0EaFd81104002234819ABe752bCa0d41b097F': {
            from: '0x3c9d6c1C73b31c837832c72E04D3152f051fc1A9',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xdeb288F737066589598e9214E782fa5A8eD689e8': {
            from: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 8,
            toDecimals: 18
        },
        '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c': {
            from: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 8,
            toDecimals: 8
        },
        '0x614715d2Af89E6EC99A233818275142cE88d1Cfd': {
            from: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x8f7C7181Ed1a2BA41cfC3f5d064eF91b67daef66': {
            from: '0x56d811088235F11C8920698a204A5010a788f4b3',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x75FbD83b4bd51dEe765b2a01e8D3aa1B020F9d33': {
            from: '0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 4,
            toDecimals: 18
        },
        '0x1B39Ee86Ec5979ba5C322b826B3ECb8C79991699': {
            from: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5': {
            from: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x7B6230EF79D5E97C11049ab362c0b685faCBA0C2': {
            from: '0x4688a8b1F292FDaB17E9a90c8Bc379dC1DBd8713',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x0ad50393F11FfAc4dd0fe5F1056448ecb75226Cf': {
            from: '0x4688a8b1F292FDaB17E9a90c8Bc379dC1DBd8713',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x82597CFE6af8baad7c0d441AA82cbC3b51759607': {
            from: '0x2ba592F78dB6436527729929AAf6c908497cB200',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xcA696a9Eb93b81ADFE6435759A29aB4cf2991A96': {
            from: '0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 8,
            toDecimals: 18
        },
        '0x8a12Be339B0cD1829b91Adc01977caa5E9ac121e': {
            from: '0xD533a949740bb3306d119CC777fa900bA034cd52',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f': {
            from: '0xD533a949740bb3306d119CC777fa900bA034cd52',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x773616E4d11A78F511299002da57A0a94577F1f4': {
            from: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9': {
            from: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x029849bbc0b1d93b85a8b6190e979fd38F5760E2': {
            from: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xD2A593BF7594aCE1faD597adb697b5645d5edDB2': {
            from: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x24D9aB51950F3d62E9144fdC2f3135DAA6Ce8D1B': {
            from: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419': {
            from: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xbf86e7B2565eAc3bFD80634176F31bd186566b06': {
            from: '0xf8C3527CC04340b208C854E985240c02F7B7793f',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x2DE7E4a9488488e0058B95854CC2f7955B35dC9b': {
            from: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xF0985f7E2CaBFf22CecC5a71282a89582c382EFE': {
            from: '0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x6Ebc52C8C1089be9eB3945C4350B68B8E4C2233f': {
            from: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x17D054eCac33D91F7340645341eFB5DE9009F1C1': {
            from: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xAf5E8D9Cd9fC85725A83BF23C52f1C39A71588a6': {
            from: '0x584bC13c7D411c00c01A62e8019472dE68768430',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xBFC189aC214E6A4a35EBC281ad15669619b75534': {
            from: '0x584bC13c7D411c00c01A62e8019472dE68768430',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x1B61BAD1495161bCb6C03DDB0E41622c0270bB1A': {
            from: '0xdF574c24545E5FfEcb9a659c229253D4111d87e1',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 8,
            toDecimals: 18
        },
        '0xaE2EbE3c4D20cE13cE47cbb49b6d7ee631Cd816e': {
            from: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x656c0544eF4C98A6a98491833A89204Abb045d6b': {
            from: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xf8fF43E991A81e6eC886a3D281A2C6cC19aE70Fc': {
            from: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xe7015CCb7E5F788B8c1010FC22343473EaaC3741': {
            from: '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xDC530D9457755926550b59e8ECcdaE7624181557': {
            from: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c': {
            from: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x160AC928A16C93eD4895C2De6f81ECcE9a7eB7b4': {
            from: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xFd33ec6ABAa1Bdc3D9C6C85f1D6299e5a1a5511F': {
            from: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x82A44D92D6c329826dc557c5E1Be6ebeC5D5FeB9': {
            from: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676': {
            from: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x24551a8Fb2A7211A25a17B1481f043A8a8adC7f2': {
            from: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xDaeA8386611A157B08829ED4997A8A62B557014C': {
            from: '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x98334b85De2A8b998Ba844c5521e73D68AD69C00': {
            from: '0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xc751E86208F0F8aF2d5CD0e29716cA7AD98B5eF5': {
            from: '0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x9cB2A01A7E64992d32A34db7cEea4c919C391f6A': {
            from: '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x9b0FC4bb9981e5333689d69BdBF66351B9861E62': {
            from: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x2c881B6f3f6B5ff6C975813F87A4dad0b241C15b': {
            from: '0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x22134617Ae0f6CA8D89451e5Ae091c94f7D743DC': {
            from: '0x75231F58b43240C9718Dd58B4967c5114342a86c',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x57C9aB3e56EE4a83752c181f241120a3DBba06a1': {
            from: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xbA9B2a360eb8aBdb677d6d7f27E12De11AA052ef': {
            from: '0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 8,
            toDecimals: 18
        },
        '0xd75AAaE4AF0c398ca13e2667Be57AF2ccA8B5de6': {
            from: '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x3a08ebBaB125224b7b6474384Ee39fBb247D2200': {
            from: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x9B97304EA12EFed0FAd976FBeCAad46016bf269e': {
            from: '0x45804880De22913dAFE09f4980848ECE6EcbAf78',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x3b41D5571468904D4e53b6a8d93A6BaC43f02dC9': {
            from: '0xbC396689893D065F41bc2C6EcbeE5e0085233447',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x4ad7B025127e89263242aB68F0f9c4E5C033B489': {
            from: '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x2a784368b1D492f458Bf919389F42c18315765F5': {
            from: '0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xEa0b3DCa635f4a4E77D9654C5c18836EE771566e': {
            from: '0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6',
            to: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x3147D7203354Dc06D9fd350c7a2437bcA92387a4': {
            from: '0x408e41876cCCDC0F92210600ef50372656052a38',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x0f59666EDE214281e956cb3b2D0d69415AfF4A01': {
            from: '0x408e41876cCCDC0F92210600ef50372656052a38',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xD4CE430C3b67b3E2F7026D86E7128588629e2455': {
            from: '0x221657776846890989a759BA2973e427DfF5C9bB',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xc16935B445F4BDC172e408433c8f7101bbBbE368': {
            from: '0xD291E7a03283640FDc51b121aC401383A46cC623',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x4cba1e1fdc738D0fe8DB3ee07728E2Bc4DA676c6': {
            from: '0x607F4C5BB672230e8672085532f7e901544a7375',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 9,
            toDecimals: 18
        },
        '0x875D60C44cfbC38BaA4Eb2dDB76A767dEB91b97e': {
            from: '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x48731cF7e84dc94C5f84577882c14Be11a5B7456': {
            from: '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x35E3f7E558C04cE7eEE1629258EcbbA03B36Ec56': {
            from: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x79291A9d692Df95334B1a0B3B4AE6bC606782f8c': {
            from: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xDC3EA94CD0AC27d9A86C180091e7f78C683d3699': {
            from: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x050c048c9a0CD0e76f166E2539F87ef2acCEC58f': {
            from: '0x476c5E26a75bd202a9683ffD34359C0CC15be0fF',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 6,
            toDecimals: 18
        },
        '0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757': {
            from: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xe572CeF69f43c2E488b33924AF04BDacE19079cf': {
            from: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xAE51d1f913eDB0f80562F270017806f3e9566029': {
            from: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xFb0CfD6c19e25DB4a08D8a204a387cEa48Cc138f': {
            from: '0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x3d44925a8E9F9DFd90390E58e92Ec16c996A331b': {
            from: '0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x26929b85fE284EeAB939831002e1928183a10fb1': {
            from: '0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 8,
            toDecimals: 8
        },
        '0xB09fC5fD3f11Cf9eb5E1C5Dba43114e3C9f477b5': {
            from: '0xc12eCeE46ed65D970EE5C899FCC7AE133AfF9b03',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x3886BA987236181D98F2401c507Fb8BeA7871dF2': {
            from: '0x0000000000085d4780B73119b644AE5ecd22b376',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xf817B69EA583CAFF291E287CaE00Ea329d22765C': {
            from: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xD6aA3D25116d8dA79Ea0246c4826EB951872e02e': {
            from: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x553303d460EE0afB37EdFf9bE42922D8FF63220e': {
            from: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x986b5E1e1755e3C2440e960477f25201B0a8bbD4': {
            from: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 6,
            toDecimals: 18
        },
        '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6': {
            from: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 6,
            toDecimals: 8
        },
        '0xfAC81Ea9Dd29D8E9b212acd6edBEb6dE38Cb43Af': {
            from: '0x1c48f86ae57291F7686349F12601910BD8D470bb',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46': {
            from: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 6,
            toDecimals: 18
        },
        '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D': {
            from: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 6,
            toDecimals: 8
        },
        '0xa20623070413d42a5C01Db2c8111640DD7A5A03a': {
            from: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x9a79fdCd0E326dF6Fa34EA13c05d3106610798E9': {
            from: '0x1cF4592ebfFd730c7dc92c1bdFFDfc3B9EfCf29a',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xe5Dc0A609Ab8bCF15d3f35cFaa1Ff40f521173Ea': {
            from: '0x0d438F3b5175Bebc262bF23753C1E53d03432bDE',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xcEBD2026d3C99F2a7CE028acf372C154aB4638a9': {
            from: '0xBd356a39BFf2cAda8E9248532DD879147221Cf76',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x7c5d4F8345e66f68099581Db340cd65B078C41f4': {
            from: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xA027702dbb89fbd58938e4324ac03B58d812b0E1': {
            from: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xaaB2f6b45B28E962B3aCd1ee4fC88aEdDf557756': {
            from: '0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x2Da4983a622a8498bb1a21FaE9D8F6C664939962': {
            from: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x2885d15b8Af22648b98B122b22FDF4D2a56c6023': {
            from: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xE1329B3f6513912CAf589659777b66011AEE5880': {
            from: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x4EA6Ec4C1691C62623122B213572b2be5A618C0d': {
            from: '0x33D0568941C0C64ff7e0FB4fbA0B11BD37deEd9f',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xeA286b2584F79Cd4D322Fe107d9683971c890596': {
            from: '0xb753428af26E81097e7fD17f40c88aaA3E04902c',
            to: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        }
    },
    [ChainId.KOVAN]: {
        '0xBc3f28Ccc21E9b5856E81E6372aFf57307E2E883': {
            from: '0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3',
            to: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x24D6B177CF20166cd8F55CaaFe1c745B44F6c203': {
            from: '0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x64EaC61A2DFda2c3Fa04eED49AA33D021AeC8838': {
            from: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
            to: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
            decimals: 18,
            fromDecimals: 6,
            toDecimals: 18
        },
        '0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60': {
            from: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 6,
            toDecimals: 8
        },
        '0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541': {
            from: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
            to: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x777A68032a88E5A84678A77Af2CD65A7b3c0775a': {
            from: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x0bF499444525a23E7Bb61997539725cA2e928138': {
            from: '0x07de306FF27a2B630B1141956844eB1552B956B5',
            to: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
            decimals: 18,
            fromDecimals: 6,
            toDecimals: 18
        },
        '0x2ca5A90D34cA333661083F89D831f757A9A50148': {
            from: '0x07de306FF27a2B630B1141956844eB1552B956B5',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 6,
            toDecimals: 8
        },
        '0xECF93D14d25E02bA2C13698eeDca9aA98348EFb6': {
            from: '0x61460874a7196d6a22D1eE4922473664b3E95270',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x0e4fcEC26c9f85c3D714370c98f43C4E02Fc35Ae': {
            from: '0x482dC9bB08111CB875109B075A40881E48aE02Cd',
            to: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xF7904a295A029a3aBDFFB6F12755974a958C7C25': {
            from: '0xd3A691C852CDB01E281545A27064741F0B7f6825',
            to: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
            decimals: 18,
            fromDecimals: 8,
            toDecimals: 18
        },
        '0x6135b13325bfC4B00278B4abC5e20bbce2D6580e': {
            from: '0xd3A691C852CDB01E281545A27064741F0B7f6825',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 8,
            toDecimals: 8
        },
        '0x3A7e6117F2979EFf81855de32819FBba48a63e9e': {
            from: '0x50DD65531676F718B018De3dc48F92B53D756996',
            to: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x8f4e77806EFEC092A279AC6A49e129e560B4210E': {
            from: '0x50DD65531676F718B018De3dc48F92B53D756996',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        }
    },
    [ChainId.BSC]: {
        '0x2d5Fc41d1365fFe13d03d91E82e04Ca878D69f4B': {
            from: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xa767f745331D267c7751297D982b050c93985627': {
            from: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x3334bF7ec892Ca03D1378B51769b7782EAF318C4': {
            from: '0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x2a548935a323Bb7329a5E3F1667B979f16Bc890b': {
            from: '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x43d80f616DAf0b0B42a928EeD32147dC59027D41': {
            from: '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE': {
            from: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x116EeB23384451C78ed366D4f67D5AD44eE771A0': {
            from: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf': {
            from: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x87Ea38c9F24264Ec1Fff41B04ec94a97Caf99941': {
            from: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xcBb98864Ef56E9042e7d2efef76141f15731B82f': {
            from: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x6f55DFAf098a813d87BB4e6392275b502360Bb9D': {
            from: '0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x8EC213E7191488C7873cEC6daC8e97cdbAdb7B35': {
            from: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x132d3C0B1D2cEa0BC552588063bdBb210FDeecfA': {
            from: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xBA8683E9c3B1455bE6e18E7768e8cAD95Eb5eD49': {
            from: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xC333eb0086309a16aa7c8308DfD32c8BBA0a2592': {
            from: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xed93F3764334788f2f6628b30e505fe1fc5d1D7b': {
            from: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x63D407F32Aa72E63C7209ce1c2F5dA40b3AaE726': {
            from: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e': {
            from: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xB38722F6A608646a538E882Ee9972D15c86Fc597': {
            from: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xca236E327F629f9Fc2c30A4E95775EbF0B89fac8': {
            from: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x4e5a43A79f53c0a8e83489648Ea7e429278f8b2D': {
            from: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x74E72F37A8c415c8f1a98Ed42E78Ff997435791D': {
            from: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xE188A9875af525d25334d75F3327863B2b8cd0F1': {
            from: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xb57f259E7C24e56a1dA00F66b55A5640d9f9E7e4': {
            from: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x45f86CA2A8BC9EBD757225B19a1A0D7051bE46Db': {
            from: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x51597f405303C4377E36123cBc172b13269EA163': {
            from: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xD5c40f5144848Bd4EF08a9605d860e727b991513': {
            from: '0x55d398326f99059fF775485246999027B3197955',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xB97Ad0E74fa7d920791E90258A6E2085088b4320': {
            from: '0x55d398326f99059fF775485246999027B3197955',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x798A65D349B2B5E6645695912880b54dfFd79074': {
            from: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x93A67D414896A280bF8FFB3b389fE3686E014fda': {
            from: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x8264d6983B219be65C4D62f1c82B3A2999944cF2': {
            from: '0x16939ef78684453bfDFb47825F8a5F714f12623a',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xBF63F430A79D4036A5900C19818aFf1fa710f206': {
            from: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xF841761481DF19831cCC851A54D8350aE6022583': {
            from: '0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e',
            to: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xD7eAa5Bf3013A96e3d515c055Dbd98DbdC8c620D': {
            from: '0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        }
    },
    [ChainId.HECO]: {
        '0x8a054991B803F6a6958Ba9695Cc8D366C8a30a69': {
            from: '0x202b4936fE1a82A4965220860aE46d7d3939Bb25',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x98b666722D9Def641D8D4836c7cA3c38317B6B98': {
            from: '0xeF3CEBD77E0C52cb6f60875d9306397B5Caca375',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xD5c40f5144848Bd4EF08a9605d860e727b991513': {
            from: '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x0A7b23E981F16a429C8710C82f5fa5d01453A259': {
            from: '0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x5Fa530068e0F5046479c588775c157930EF0Dff0': {
            from: '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x8EC213E7191488C7873cEC6daC8e97cdbAdb7B35': {
            from: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x45f86CA2A8BC9EBD757225B19a1A0D7051bE46Db': {
            from: '0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x87Ea38c9F24264Ec1Fff41B04ec94a97Caf99941': {
            from: '0xecb56cf772B5c9A6907FB7d32387Da2fCbfB63b4',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xaC4600b8F42317eAF056Cceb06cFf987c294840B': {
            from: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x1797a410485FeD6B05d5b39A475ddB9C33898ee8': {
            from: '0x777850281719d5a96C29812ab72f822E0e09F3Da',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x1E22E1eD4a96B4529D78cd4Bac55313809deF016': {
            from: '0x22C54cE8321A4015740eE1109D9cBc25815C46E6',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xF0D3585D8dC9f1D1D1a7dd02b48C2630d9DD78eD': {
            from: '0xa71EdC38d189767582C38A3145b5873052c3e47a',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        }
    },
    [ChainId.MATIC]: {
        '0xbE23a3AA13038CfC28aFd0ECe4FdE379fE7fBfc4': {
            from: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
            to: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xc907E116054Ad103354f2D350FD2514433D57F6f': {
            from: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xFC539A559e170f848323e19dfD66007520510085': {
            from: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            to: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D': {
            from: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xF9680D99D6C9589e2a93a78A04A279e509205945': {
            from: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0x327e23A4855b6F663a28c5161541d69Af8973302': {
            from: '0x084666322d3ee89aAbDBBCd084323c9AF705C7f5',
            to: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            fromDecimals: 18,
            toDecimals: 18
        },
        '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0': {
            from: '0x084666322d3ee89aAbDBBCd084323c9AF705C7f5',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 18,
            toDecimals: 8
        },
        '0xefb7e6be8356cCc6827799B6A7348eE674A80EaE': {
            from: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            to: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            fromDecimals: 6,
            toDecimals: 18
        },
        '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7': {
            from: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 6,
            toDecimals: 8
        },
        '0xf9d5AAC6E5572AEFa6bd64108ff86a222F69B64d': {
            from: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            to: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            fromDecimals: 6,
            toDecimals: 18
        },
        '0x0A6513e40db6EB1b165753AD52E80663aeA50545': {
            from: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            to: '0x0000000000000000000000000000000000000001',
            decimals: 8,
            fromDecimals: 6,
            toDecimals: 8
        },
        '0xA338e0492B2F944E9F8C0653D3AD1484f2657a37': {
            from: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            to: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 8,
            fromDecimals: 8,
            toDecimals: 18
        }
    }
}
