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
        { symbol: 'RAMP', name: 'RAMP DEFI', address: '0x33D0568941C0C64ff7e0FB4fbA0B11BD37deEd9f', decimals: 18 },
        {
            symbol: 'LON',
            name: 'Tokenlon Network Token',
            address: '0x0000000000095413afc295d19edeb1ad7b71c952',
            decimals: 18
        },
        {
            symbol: 'DNT',
            name: 'district0x',
            address: '0x0AbdAce70D3790235af448C88547603b945604ea',
            decimals: 18
        },
        {
            symbol: 'renZEC',
            name: 'renZEC',
            address: '0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2',
            decimals: 18
        }
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
        { symbol: 'WETH', name: 'Wrapped Ether', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18 },
        { symbol: 'COIN', name: 'coin_artist', address: '0x87b008E57F640D94Ee44Fd893F0323AF933F9195', decimals: 18 },
        { symbol: 'RAMP', name: 'RAMP DEFI', address: '0x8519EA49c997f50cefFa444d240fB655e89248Aa', decimals: 18 },
        { symbol: 'VAI', name: 'VAI Stablecoin', address: '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7', decimals: 18 },
        {
            symbol: 'ONT',
            name: 'Binance-Peg Ontology Token',
            address: '0xFd7B3A77848f1C2D67E05E54d78d174a0C850335',
            decimals: 18
        },
        {
            symbol: 'FIL',
            name: 'Binance-Peg Filecoin',
            address: '0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153',
            decimals: 18
        },
        {
            symbol: 'DOGE',
            name: 'Binance-Peg Dogecoin',
            address: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
            decimals: 8
        },
        {
            symbol: 'ICE',
            name: 'IceToken',
            address: '0xf16e81dce15B08F326220742020379B855B87DF9',
            decimals: 18
        },
        {
            symbol: 'EOS',
            name: 'Binance-Peg EOS Token',
            address: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6',
            decimals: 18
        },
        {
            symbol: 'XTZ',
            name: 'Binance-Peg Tezos Token',
            address: '0x16939ef78684453bfDFb47825F8a5F714f12623a',
            decimals: 18
        },
        {
            symbol: 'CAKE',
            name: 'PancakeSwap Token',
            address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
            decimals: 18
        }
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
            address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
            decimals: 18
        },

        { symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
        { symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },

        { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', decimals: 8 }
    ]
}
