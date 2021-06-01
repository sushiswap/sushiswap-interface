import { ChainId } from '@sushiswap/sdk'

const TOKEN_ICONS: { [chainId in ChainId]?: any } = {
    [ChainId.MAINNET]: {
        [String('0x111111111117dC0aa78b770fA6A738034120C302').toLowerCase()]:
            '1INCH-square',
        [String('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9').toLowerCase()]:
            'AAVE-square',
        [String('0xc14777C94229582E5758C5a79b83DDE876b9BE98').toLowerCase()]:
            'ADA-square',
        [String('0xADE00C28244d5CE17D72E40330B1c318cD12B7c3').toLowerCase()]:
            'ADX-square',
        [String('0xa1faa113cbE53436Df28FF0aEe54275c13B40975').toLowerCase()]:
            'ALPHA-square',
        [String('0xfF20817765cB7f73d4bde2e66e067E58D11095C2').toLowerCase()]:
            'AMP-square',
        [String('0xD46bA6D942050d489DBd938a2C909A5d5039A161').toLowerCase()]:
            'AMPL-square',
        [String('0xa117000000f279D81A1D3cc75430fAA017FA5A2e').toLowerCase()]:
            'ANT-square',
        [String('0x3472A5A71965499acd81997a54BBA8D852C6E53d').toLowerCase()]:
            'BADGER-square',
        [String('0xba100000625a3754423978a60c9317c58a424e3D').toLowerCase()]:
            'BALANCER-square',
        [String('0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55').toLowerCase()]:
            'BAND-square',
        [String('0x0D8775F648430679A709E98d2b0Cb6250d2887EF').toLowerCase()]:
            'BAT-square',
        [String('0x3aD44A16451d65D97394aC793b0a2d90c8530499').toLowerCase()]:
            'BCH-square',
        [String('0xB8c77482e45F1F44dE1745F52C74426C631bDD52').toLowerCase()]:
            'BNB-square',
        [String('0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C').toLowerCase()]:
            'BNT-square',
        [String('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599').toLowerCase()]:
            'BTC-square',
        [String('0x4Fabb145d64652a948d72533023f6E7A623C7C53').toLowerCase()]:
            'BUSD-square',
        [String('0x56d811088235F11C8920698a204A5010a788f4b3').toLowerCase()]:
            'BZRX-square',
        [String('0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d').toLowerCase()]:
            'CEL-square',
        [String('0xc00e94Cb662C3520282E6f5717214004A7f26888').toLowerCase()]:
            'COMP-square',
        [String('0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713').toLowerCase()]:
            'COVER-square',
        [String('0x2ba592F78dB6436527729929AAf6c908497cB200').toLowerCase()]:
            'CREAM-square',
        [String('0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b').toLowerCase()]:
            'CRO-square',
        [String('0xD533a949740bb3306d119CC777fa900bA034cd52').toLowerCase()]:
            'CRV-square',
        [String('0x6B175474E89094C44Da98b954EedeAC495271d0F').toLowerCase()]:
            'DAI-square',
        [String('0xF04f22b39bF419FdEc8eAE7C69c5E89872915f53').toLowerCase()]:
            'UNKNOWN-square', // DASH
        // [String('').toLowerCase()]: DOT,
        [String('0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b').toLowerCase()]:
            'DPI-square',
        [String('0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c').toLowerCase()]:
            'ENJ-square',
        [String('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2').toLowerCase()]:
            'ETH-square',
        [String('0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0').toLowerCase()]:
            'EOS-square',
        // [String('').toLowerCase()]: FNX,
        [String('0x4E15361FD6b4BB609Fa63C81A2be19d873717870').toLowerCase()]:
            'FTM-square',
        [String('0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9').toLowerCase()]:
            'FTX-square',
        [String('0xc944E90C64B2c07662A292be6244BDf05Cda44a7').toLowerCase()]:
            'GRT-square',
        [String('0x584bC13c7D411c00c01A62e8019472dE68768430').toLowerCase()]:
            'HEGIC-square',
        [String('0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30').toLowerCase()]:
            'INJ-square',
        [String('0xdd974D5C2e2928deA5F71b9825b8b646686BD200').toLowerCase()]:
            'KNC-square',
        [String('0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44').toLowerCase()]:
            'KP3R-square',
        [String('0x514910771AF9Ca656af840dff83E8264EcF986CA').toLowerCase()]:
            'LINK-square',
        [String('0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD').toLowerCase()]:
            'LRC-square',
        // [String('').toLowerCase()]: LTC,
        [String('0x0F5D2fB29fb7d3CFeE444a200298f468908cC942').toLowerCase()]:
            'MANA-square',
        [String('0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0').toLowerCase()]:
            'POLYGON-square',
        [String('0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2').toLowerCase()]:
            'MKR-square',
        [String('0xec67005c4E498Ec7f55E092bd1d35cbC47C91892').toLowerCase()]:
            'MLN-square',
        [String('0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2').toLowerCase()]:
            'MTA-square',
        [String('0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671').toLowerCase()]:
            'NMR-square',

        [String('0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26').toLowerCase()]:
            'OGN-square',
        [String('0xd26114cd6EE289AccF82350c8d8487fedB8A0C07').toLowerCase()]:
            'OMG-square',
        [String('0x4575f41308EC1483f3d399aa9a2826d74Da13Deb').toLowerCase()]:
            'OXT-square',
        [String('0x8E870D67F660D95d5be530380D0eC0bd388289E1').toLowerCase()]:
            'PAX-square',
        [String('0x45804880De22913dAFE09f4980848ECE6EcbAf78').toLowerCase()]:
            'PAXG-square',
        [String('0xbC396689893D065F41bc2C6EcbeE5e0085233447').toLowerCase()]:
            'PERP-square',
        [String('0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6').toLowerCase()]:
            'RCN-square',
        [String('0x408e41876cCCDC0F92210600ef50372656052a38').toLowerCase()]:
            'REN-square',
        [String('0x221657776846890989a759BA2973e427DfF5C9bB').toLowerCase()]:
            'REPV2-square',
        [String('0x607F4C5BB672230e8672085532f7e901544a7375').toLowerCase()]:
            'RLC-square',
        [String('0x3155BA85D5F96b2d030a4966AF206230e46849cb').toLowerCase()]:
            'RUNE-square',
        [String('0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F').toLowerCase()]:
            'SNX-square',
        [String('0x476c5E26a75bd202a9683ffD34359C0CC15be0fF').toLowerCase()]:
            'SRM-square',
        [String('0x57Ab1ec28D129707052df4dF418D58a2D46d5f51').toLowerCase()]:
            'SUSD-square',
        [String('0x6B3595068778DD592e39A122f4f5a5cF09C90fE2').toLowerCase()]:
            'SUSHI-square',
        [String('0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9').toLowerCase()]:
            'SXP-square',
        [String('0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa').toLowerCase()]:
            'TOMOE-square',
        [String('0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784').toLowerCase()]:
            'TRU-square',
        [String('0x0000000000085d4780B73119b644AE5ecd22b376').toLowerCase()]:
            'TUSD-square',
        [String('0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828').toLowerCase()]:
            'UMA-square',
        [String('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984').toLowerCase()]:
            'UNI-square',
        [String('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48').toLowerCase()]:
            'USDC-square',
        [String('0xdAC17F958D2ee523a2206206994597C13D831ec7').toLowerCase()]:
            'USDT-square',
        [String('0xa47c8bf37f92aBed4A126BDA807A7b7498661acD').toLowerCase()]:
            'UST-square',
        [String('0x1cF4592ebfFd730c7dc92c1bdFFDfc3B9EfCf29a').toLowerCase()]:
            'WAVES-square',
        [String('0x0d438F3b5175Bebc262bF23753C1E53d03432bDE').toLowerCase()]:
            'WNXM-square',
        // [String('').toLowerCase()]: XRP,
        [String('0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272').toLowerCase()]:
            'XSUSHI-square',
        [String('0x23693431dE4CcCAe05d0CAF63bE0f1dcFcDf4906').toLowerCase()]:
            'XTZ-square',
        [String('0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e').toLowerCase()]:
            'YFI-square',
        [String('0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83').toLowerCase()]:
            'YFII-square',
        [String('0xE41d2489571d322189246DaFA5ebDe1F4699F498').toLowerCase()]:
            'ZRX-square',
        [String('0xcB97e65F07DA24D46BcDD078EBebd7C6E6E3d750').toLowerCase()]:
            'BTM-square',
        [String('0x33D0568941C0C64ff7e0FB4fbA0B11BD37deEd9f').toLowerCase()]:
            'RAMP-square',
        [String('0x6f259637dcD74C767781E37Bc6133cd6A68aa161').toLowerCase()]:
            'HECO-square',
        [String('0xb753428af26E81097e7fD17f40c88aaA3E04902c').toLowerCase()]:
            'SFI-square',
        [String('0xBd356a39BFf2cAda8E9248532DD879147221Cf76').toLowerCase()]:
            'WOM-square',
        [String('0x1c48f86ae57291F7686349F12601910BD8D470bb').toLowerCase()]:
            'USDK-square',
        [String('0xc12eCeE46ed65D970EE5C899FCC7AE133AfF9b03').toLowerCase()]:
            'TRY-square',
        [String('0x3845badAde8e6dFF049820680d1F14bD3903a5d0').toLowerCase()]:
            'SAND-square',
        [String('0x8Ab7404063Ec4DBcfd4598215992DC3F8EC853d7').toLowerCase()]:
            'AKRO-square',
        [String('0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4').toLowerCase()]:
            'ANKR-square',
        [String('0x3c9d6c1C73b31c837832c72E04D3152f051fc1A9').toLowerCase()]:
            'BOR-square',
        [String('0xA9B1Eb5908CfC3cdf91F9B8B3a74108598009096').toLowerCase()]:
            'AUCTION-square',
        [String('0xf8C3527CC04340b208C854E985240c02F7B7793f').toLowerCase()]:
            'FRONT-square',
        [String('0xdF574c24545E5FfEcb9a659c229253D4111d87e1').toLowerCase()]:
            'HUSD-square',
        [String('0x967da4048cD07aB37855c090aAF366e4ce1b9F48').toLowerCase()]:
            'OCEAN-square',
        [String('0x75231F58b43240C9718Dd58B4967c5114342a86c').toLowerCase()]:
            'OKB-square',
        [String('0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a').toLowerCase()]:
            'ORN-square',
        [String('0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919').toLowerCase()]:
            'RAI-square',
        [String('0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF').toLowerCase()]:
            'RARI-square',
        [String('0xD291E7a03283640FDc51b121aC401383A46cC623').toLowerCase()]:
            'RGT-square',
        [String('0x0000000000095413afc295d19edeb1ad7b71c952').toLowerCase()]:
            'LON-square',
        [String('0x0AbdAce70D3790235af448C88547603b945604ea').toLowerCase()]:
            'DNT-square',
        [String('0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2').toLowerCase()]:
            'ZEC-square',
        [String('0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0').toLowerCase()]:
            'FRX-square', // zec
    },
    [ChainId.ROPSTEN]: {
        [String('0x443Fd8D5766169416aE42B8E050fE9422f628419').toLowerCase()]:
            'BAT-square',
        [String('0x1Fe16De955718CFAb7A44605458AB023838C2793').toLowerCase()]:
            'COMP-square',
        [String('0xc2118d4d90b274016cB7a54c03EF52E6c537D957').toLowerCase()]:
            'DAI-square',
        [String('0xb19c7BFc9a7CbE4C35189d475725557A96bFb50A').toLowerCase()]:
            'LINK-square',
        [String('0x26fF7457496600C63b3E8902C9f871E60eDec4e4').toLowerCase()]:
            'SAI-square',
        [String('0x71d82Eb6A5051CfF99582F4CDf2aE9cD402A4882').toLowerCase()]:
            'UNI-square',
        [String('0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C').toLowerCase()]:
            'USDC-square',
        [String('0xBde8bB00A7eF67007A96945B3a3621177B615C44').toLowerCase()]:
            'BTC-square',
        [String('0xc778417E063141139Fce010982780140Aa0cD5Ab').toLowerCase()]:
            'ETH-square',
        [String('0xE4C6182EA459E63B8F1be7c428381994CcC2D49c').toLowerCase()]:
            'ZRX-square',
    },
    [ChainId.KOVAN]: {
        [String('0x482dC9bB08111CB875109B075A40881E48aE02Cd').toLowerCase()]:
            'BAT-square',
        [String('0x61460874a7196d6a22D1eE4922473664b3E95270').toLowerCase()]:
            'COMP-square',
        [String('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa').toLowerCase()]:
            'DAI-square',
        [String('0xD1308F63823221518Ec88EB209CBaa1ac182105f').toLowerCase()]:
            'SAI-square',
        [String('0xb7a4F3E9097C08dA09517b5aB877F7a917224ede').toLowerCase()]:
            'USDC-square',
        [String('0x07de306FF27a2B630B1141956844eB1552B956B5').toLowerCase()]:
            'USDT-square',
        [String('0xd3A691C852CDB01E281545A27064741F0B7f6825').toLowerCase()]:
            'BTC-square',
        [String('0xd0A1E359811322d97991E03f863a0C30C2cF029C').toLowerCase()]:
            'ETH-square',
        [String('0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3').toLowerCase()]:
            'ZRX-square',
        [String('0x50DD65531676F718B018De3dc48F92B53D756996').toLowerCase()]:
            'REP-square',
    },
    [ChainId.BSC]: {
        [String('0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47').toLowerCase()]:
            'ADA-square', // ADA
        [String('0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56').toLowerCase()]:
            'BUSD-square',
        [String('0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18').toLowerCase()]:
            'BAND-square',
        [String('0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf').toLowerCase()]:
            'BTC-square', // BTC
        [String('0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c').toLowerCase()]:
            'BCH-square', // BCH
        [String('0x55d398326f99059fF775485246999027B3197955').toLowerCase()]:
            'USDT-square', // BUSDT
        [String('0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888').toLowerCase()]:
            'CREAM-square',
        [String('0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3').toLowerCase()]:
            'DAI-square',
        [String('0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402').toLowerCase()]:
            'DOT-square', // DOT
        [String('0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6').toLowerCase()]:
            'EOS-square', // EIS
        [String('0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD').toLowerCase()]:
            'LINK-square',
        [String('0x4338665CBB7B2485A8855A139b75D5e34AB0DB94').toLowerCase()]:
            'LTC-square', // LTC
        [String('0x47bead2563dcbf3bf2c9407fea4dc236faba485a').toLowerCase()]:
            'SXP-square',
        [String('0xBf5140A22578168FD562DCcF235E5D43A02ce9B1').toLowerCase()]:
            'UNI-square',
        [String('0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d').toLowerCase()]:
            'USDC-square',
        [String('0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE').toLowerCase()]:
            'XRP-square', // XRP
        [String('0x16939ef78684453bfDFb47825F8a5F714f12623a').toLowerCase()]:
            'XTZ-square', // XTZ
        [String('0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63').toLowerCase()]:
            'XVS-square', // XVS
        [String('0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e').toLowerCase()]:
            'YFI-square',
        [String('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c').toLowerCase()]:
            'BNB-square', // BNB
        [String('0x2170Ed0880ac9A755fd29B2688956BD959F933F8').toLowerCase()]:
            'ETH-square',
        [String('0x87b008E57F640D94Ee44Fd893F0323AF933F9195').toLowerCase()]:
            'COIN-square', // COIN
        [String('0x8519EA49c997f50cefFa444d240fB655e89248Aa').toLowerCase()]:
            'RAMP-square',
        [String('0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7').toLowerCase()]:
            'VAI-square',
        [String('0xFd7B3A77848f1C2D67E05E54d78d174a0C850335').toLowerCase()]:
            'ONT-square',
        [String('0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153').toLowerCase()]:
            'FIL-square',
        [String('0xba2ae424d960c26247dd6c32edc70b295c744c43').toLowerCase()]:
            'DOGE-square',
        [String('0xf16e81dce15B08F326220742020379B855B87DF9').toLowerCase()]:
            'ICE-square',
        [String('0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6').toLowerCase()]:
            'EOS-square',
        [String('0x16939ef78684453bfDFb47825F8a5F714f12623a').toLowerCase()]:
            'XTZ-square',
        [String('0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82').toLowerCase()]:
            'CAKE-square',
    },
    [ChainId.MATIC]: {
        [String('0xD6DF932A45C0f255f85145f286eA0b292B21C90B').toLowerCase()]:
            'AAVE-square',
        [String('0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063').toLowerCase()]:
            'DAI-square',
        [String('0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619').toLowerCase()]:
            'ETH-square',
        [String('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270').toLowerCase()]:
            'POLYGON-square',
        [String('0x05089C9EBFFa4F0AcA269e32056b1b36B37ED71b').toLowerCase()]:
            'KRILL-square',
        [String('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174').toLowerCase()]:
            'USDC-square',
        [String('0xc2132D05D31c914a87C6611C10748AEb04B58e8F').toLowerCase()]:
            'USDT-square',
        [String('0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6').toLowerCase()]:
            'BTC-square', // WBTC
        [String('0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a').toLowerCase()]:
            'SUSHI-square', // SUSHI
        [String('0x172370d5Cd63279eFa6d502DAB29171933a610AF').toLowerCase()]:
            'CRV-square',
        [String('0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39').toLowerCase()]:
            'LINK-square',
        [String('0x50B728D8D964fd00C2d0AAD81718b71311feF68a').toLowerCase()]:
            'SNX-square',
        [String('0x7C4A54f5d20b4023D6746F1f765f4DFe7C39a7e6').toLowerCase()]:
            'RENDOGE-square',
        [String('0xD0660cD418a64a1d44E9214ad8e459324D8157f1').toLowerCase()]:
            'WOOFY-square',
        [String('0x5fe2B58c013d7601147DcdD68C143A77499f5531').toLowerCase()]:
            'GRT-square',
        [String('0x104592a158490a9228070E0A8e5343B499e125D0').toLowerCase()]:
            'FRAX-square',
        [String('0x3e121107f6f22da4911079845a470757af4e1a1b').toLowerCase()]:
            'FXS-square',
    },
    [ChainId.HECO]: {
        [String('0x202b4936fE1a82A4965220860aE46d7d3939Bb25').toLowerCase()]:
            'AAVE-square',
        [String('0x64FF637fB478863B7468bc97D30a5bF3A428a1fD').toLowerCase()]:
            'ETH-square',
        [String('0xeF3CEBD77E0C52cb6f60875d9306397B5Caca375').toLowerCase()]:
            'BCH-square', // BCH
        [String('0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa').toLowerCase()]:
            'BTC-square', // BTC
        [String('0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3').toLowerCase()]:
            'DOT-square', // DOT
        [String('0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F').toLowerCase()]:
            'HECO-square', // HT
        [String('0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047').toLowerCase()]:
            'HUSD-square', // HUSD
        [String('0xecb56cf772B5c9A6907FB7d32387Da2fCbfB63b4').toLowerCase()]:
            'LTC-square', // LTC
        [String('0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c').toLowerCase()]:
            'MDX-square', // MDX
        [String('0x777850281719d5a96C29812ab72f822E0e09F3Da').toLowerCase()]:
            'SNX-square', // SNX
        [String('0x22C54cE8321A4015740eE1109D9cBc25815C46E6').toLowerCase()]:
            'UNI-square',
        [String('0xa71EdC38d189767582C38A3145b5873052c3e47a').toLowerCase()]:
            'USDT-square',
    },
}

function getTokenIconUrl(address: string, chainId: ChainId = 1): string {
    const RESULT = TOKEN_ICONS[chainId][address.toLowerCase()]
    if (!RESULT) {
        console.log('Missing token icon', chainId, address)
        return `${process.env.PUBLIC_URL}/images/tokens/unknown.png`
    } else {
        return `${
            process.env.PUBLIC_URL
        }/images/tokens/${RESULT.toLowerCase()}.jpg`
    }
}

export default getTokenIconUrl
