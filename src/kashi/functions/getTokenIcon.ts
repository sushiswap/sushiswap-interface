import { ChainId } from '@sushiswap/sdk'

// todo: move these into sushiswap/assets/square
import ADA from '../../assets/kashi/tokens/ada-square.jpg'
import ADX from '../../assets/kashi/tokens/adx-square.jpg'
import ALPHA from '../../assets/kashi/tokens/alpha-square.jpg'
import AMP from '../../assets/kashi/tokens/amp-square.jpg'
import AMPL from '../../assets/kashi/tokens/ampl-square.jpg'
import ANT from '../../assets/kashi/tokens/ant-square.jpg'
import BADGER from '../../assets/kashi/tokens/badger-square.jpg'
import BAL from '../../assets/kashi/tokens/balancer-square.jpg'
import BNT from '../../assets/kashi/tokens/bnt-square.jpg'
import BZRX from '../../assets/kashi/tokens/bzrx-square.jpg'
import CEL from '../../assets/kashi/tokens/cel-square.jpg'
import CRO from '../../assets/kashi/tokens/cro-square.jpg'
import CRV from '../../assets/kashi/tokens/crv-square.jpg'
// import DASH from '../../assets/kashi/tokens/dash-square.jpg'
import DPI from '../../assets/kashi/tokens/dpi-square.jpg'
import ENJ from '../../assets/kashi/tokens/enj-square.jpg'
import FNX from '../../assets/kashi/tokens/fnx-square.jpg'
import FTM from '../../assets/kashi/tokens/ftm-square.jpg'
import FTX from '../../assets/kashi/tokens/ftx-square.jpg'
import GRT from '../../assets/kashi/tokens/grt-square.jpg'
import HEGIC from '../../assets/kashi/tokens/hegic-square.jpg'
import INJ from '../../assets/kashi/tokens/inj-square.jpg'
import KNC from '../../assets/kashi/tokens/knc-square.jpg'
import KP3R from '../../assets/kashi/tokens/kp3r-square.jpg'
import LRC from '../../assets/kashi/tokens/lrc-square.jpg'
import MANA from '../../assets/kashi/tokens/mana-square.jpg'
import MKR from '../../assets/kashi/tokens/mkr-square.jpg'
import MLN from '../../assets/kashi/tokens/mln-square.jpg'
import MTA from '../../assets/kashi/tokens/mta-square.jpg'
import NMR from '../../assets/kashi/tokens/nmr-square.jpg'
import OGN from '../../assets/kashi/tokens/ogn-square.jpg'
import OMG from '../../assets/kashi/tokens/omg-square.jpg'
import OXT from '../../assets/kashi/tokens/oxt-square.jpg'
import PAX from '../../assets/kashi/tokens/pax-square.jpg'
import PAXG from '../../assets/kashi/tokens/paxg-square.jpg'
import PERP from '../../assets/kashi/tokens/perp-square.jpg'
import RCN from '../../assets/kashi/tokens/rcn-square.jpg'
import REN from '../../assets/kashi/tokens/ren-square.jpg'
import RLC from '../../assets/kashi/tokens/rlc-square.jpg'
import RUNE from '../../assets/kashi/tokens/rune-square.jpg'
import SRM from '../../assets/kashi/tokens/srm-square.jpg'
import SUSD from '../../assets/kashi/tokens/susd-square.jpg'
import TOMO from '../../assets/kashi/tokens/tomoe-square.jpg'
import TRU from '../../assets/kashi/tokens/tru-square.jpg'
import TUSD from '../../assets/kashi/tokens/tusd-square.jpg'
import UMA from '../../assets/kashi/tokens/uma-square.jpg'
import UST from '../../assets/kashi/tokens/ust-square.jpg'
import WAVES from '../../assets/kashi/tokens/waves-square.jpg'
import WNXM from '../../assets/kashi/tokens/wnxm-square.jpg'
import YFII from '../../assets/kashi/tokens/yfii-square.jpg'

import INCH from '../../assets/kashi/tokens/1inch-square.jpg'
import AAVE from '../../assets/kashi/tokens/aave-square.jpg'
import BAND from '../../assets/kashi/tokens/band-square.jpg'
import BAT from '../../assets/kashi/tokens/bat-square.jpg'
import BNB from '../../assets/kashi/tokens/bnb-square.jpg'
import BUSD from '../../assets/kashi/tokens/busd-square.jpg'
import BCH from '../../assets/kashi/tokens/bch-square.jpg'
import BTC from '../../assets/kashi/tokens/btc-square.jpg'
import COMP from '../../assets/kashi/tokens/comp-square.jpg'
import COVER from '../../assets/kashi/tokens/cover-square.jpg'
import CREAM from '../../assets/kashi/tokens/cream-square.jpg'
import DAI from '../../assets/kashi/tokens/dai-square.jpg'
import DOT from '../../assets/kashi/tokens/dot-square.jpg'
import EOS from '../../assets/kashi/tokens/eos-square.jpg'
import ETH from '../../assets/kashi/tokens/eth-square.jpg'
import HT from '../../assets/kashi/tokens/heco-square.jpg'
import HUSD from '../../assets/kashi/tokens/husd-square.jpg'
import LINK from '../../assets/kashi/tokens/link-square.jpg'
import LTC from '../../assets/kashi/tokens/ltc-square.jpg'
import MATIC from '../../assets/kashi/tokens/matic-square.jpg'
import MDX from '../../assets/kashi/tokens/mdx-square.jpg'
import REP from '../../assets/kashi/tokens/repv2-square.jpg'
import SAI from '../../assets/kashi/tokens/sai-square.png'
import SNX from '../../assets/kashi/tokens/snx-square.png'
import SUSHI from '../../assets/kashi/tokens/sushi-square.jpg'
import SXP from '../../assets/kashi/tokens/sxp-square.jpg'
import UNI from '../../assets/kashi/tokens/uni-square.jpg'
import USDC from '../../assets/kashi/tokens/usdc-square.jpg'
import USDT from '../../assets/kashi/tokens/usdt-square.jpg'
import XRP from '../../assets/kashi/tokens/xrp-square.jpg'
import XVS from '../../assets/kashi/tokens/xvs-square.jpg'
import XTZ from '../../assets/kashi/tokens/xtz-square.jpg'
import YFI from '../../assets/kashi/tokens/yfi-square.jpg'
import ZRX from '../../assets/kashi/tokens/zrx-square.jpg'

import UNKNOWN from '../../assets/kashi/tokens/unknown.png'

const TOKEN_ICONS: { [chainId in ChainId]?: any } = {
    [ChainId.MAINNET]: {
        [String('0x111111111117dC0aa78b770fA6A738034120C302').toLowerCase()]: INCH,
        [String('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9').toLowerCase()]: AAVE,

        [String('0xc14777C94229582E5758C5a79b83DDE876b9BE98').toLowerCase()]: ADA,
        [String('0xADE00C28244d5CE17D72E40330B1c318cD12B7c3').toLowerCase()]: ADX,
        [String('0xa1faa113cbE53436Df28FF0aEe54275c13B40975').toLowerCase()]: ALPHA,
        [String('0xfF20817765cB7f73d4bde2e66e067E58D11095C2').toLowerCase()]: AMP,
        [String('0xD46bA6D942050d489DBd938a2C909A5d5039A161').toLowerCase()]: AMPL,
        [String('0xa117000000f279D81A1D3cc75430fAA017FA5A2e').toLowerCase()]: ANT,
        [String('0x3472A5A71965499acd81997a54BBA8D852C6E53d').toLowerCase()]: BADGER,
        [String('0xba100000625a3754423978a60c9317c58a424e3D').toLowerCase()]: BAL,
        [String('0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55').toLowerCase()]: BAND,
        [String('0x0D8775F648430679A709E98d2b0Cb6250d2887EF').toLowerCase()]: BAT,
        [String('0x3aD44A16451d65D97394aC793b0a2d90c8530499').toLowerCase()]: BCH,
        [String('0xB8c77482e45F1F44dE1745F52C74426C631bDD52').toLowerCase()]: BNB,
        [String('0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C').toLowerCase()]: BNT,
        [String('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599').toLowerCase()]: BTC,
        [String('0x4Fabb145d64652a948d72533023f6E7A623C7C53').toLowerCase()]: BUSD,
        [String('0x56d811088235F11C8920698a204A5010a788f4b3').toLowerCase()]: BZRX,
        [String('0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d').toLowerCase()]: CEL,
        [String('0xc00e94Cb662C3520282E6f5717214004A7f26888').toLowerCase()]: COMP,
        [String('0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713').toLowerCase()]: COVER,
        [String('0x2ba592F78dB6436527729929AAf6c908497cB200').toLowerCase()]: CREAM,
        [String('0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b').toLowerCase()]: CRO,
        [String('0xD533a949740bb3306d119CC777fa900bA034cd52').toLowerCase()]: CRV,
        [String('0x6B175474E89094C44Da98b954EedeAC495271d0F').toLowerCase()]: DAI,
        [String('0xF04f22b39bF419FdEc8eAE7C69c5E89872915f53').toLowerCase()]: UNKNOWN, // DASH
        // [String('').toLowerCase()]: DOT,
        [String('0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b').toLowerCase()]: DPI,
        [String('0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c').toLowerCase()]: ENJ,
        [String('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2').toLowerCase()]: ETH,
        [String('0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0').toLowerCase()]: EOS,
        // [String('').toLowerCase()]: FNX,
        [String('0x4E15361FD6b4BB609Fa63C81A2be19d873717870').toLowerCase()]: FTM,
        [String('0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9').toLowerCase()]: FTX,
        [String('0xc944E90C64B2c07662A292be6244BDf05Cda44a7').toLowerCase()]: GRT,
        [String('0x584bC13c7D411c00c01A62e8019472dE68768430').toLowerCase()]: HEGIC,
        [String('0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30').toLowerCase()]: INJ,
        [String('0xdd974D5C2e2928deA5F71b9825b8b646686BD200').toLowerCase()]: KNC,
        [String('0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44').toLowerCase()]: KP3R,
        [String('0x514910771AF9Ca656af840dff83E8264EcF986CA').toLowerCase()]: LINK,
        [String('0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD').toLowerCase()]: LRC,
        // [String('').toLowerCase()]: LTC,
        [String('0x0F5D2fB29fb7d3CFeE444a200298f468908cC942').toLowerCase()]: MANA,
        [String('0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0').toLowerCase()]: MATIC,
        [String('0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2').toLowerCase()]: MKR,
        [String('0xec67005c4E498Ec7f55E092bd1d35cbC47C91892').toLowerCase()]: MLN,
        [String('0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2').toLowerCase()]: MTA,
        [String('0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671').toLowerCase()]: NMR,

        [String('0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26').toLowerCase()]: OGN,
        [String('0xd26114cd6EE289AccF82350c8d8487fedB8A0C07').toLowerCase()]: OMG,
        [String('0x4575f41308EC1483f3d399aa9a2826d74Da13Deb').toLowerCase()]: OXT,
        [String('0x8E870D67F660D95d5be530380D0eC0bd388289E1').toLowerCase()]: PAX,
        [String('0x45804880De22913dAFE09f4980848ECE6EcbAf78').toLowerCase()]: PAXG,
        [String('0xbC396689893D065F41bc2C6EcbeE5e0085233447').toLowerCase()]: PERP,
        [String('0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6').toLowerCase()]: RCN,
        [String('0x408e41876cCCDC0F92210600ef50372656052a38').toLowerCase()]: REN,
        [String('0x221657776846890989a759BA2973e427DfF5C9bB').toLowerCase()]: REP,
        [String('0x607F4C5BB672230e8672085532f7e901544a7375').toLowerCase()]: RLC,
        [String('0x3155BA85D5F96b2d030a4966AF206230e46849cb').toLowerCase()]: RUNE,
        [String('0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F').toLowerCase()]: SNX,
        [String('0x476c5E26a75bd202a9683ffD34359C0CC15be0fF').toLowerCase()]: SRM,
        [String('0x57Ab1ec28D129707052df4dF418D58a2D46d5f51').toLowerCase()]: SUSD,
        [String('0x6B3595068778DD592e39A122f4f5a5cF09C90fE2').toLowerCase()]: SUSHI,
        [String('0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9').toLowerCase()]: SXP,
        [String('0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa').toLowerCase()]: TOMO,
        [String('0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784').toLowerCase()]: TRU,
        [String('0x0000000000085d4780B73119b644AE5ecd22b376').toLowerCase()]: TUSD,
        [String('0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828').toLowerCase()]: UMA,
        [String('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984').toLowerCase()]: UNI,
        [String('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48').toLowerCase()]: USDC,
        [String('0xdAC17F958D2ee523a2206206994597C13D831ec7').toLowerCase()]: USDT,
        [String('0xa47c8bf37f92aBed4A126BDA807A7b7498661acD').toLowerCase()]: UST,
        [String('0x1cF4592ebfFd730c7dc92c1bdFFDfc3B9EfCf29a').toLowerCase()]: WAVES,
        [String('0x0d438F3b5175Bebc262bF23753C1E53d03432bDE').toLowerCase()]: WNXM,
        // [String('').toLowerCase()]: XRP,
        [String('0x23693431dE4CcCAe05d0CAF63bE0f1dcFcDf4906').toLowerCase()]: XTZ,
        [String('0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e').toLowerCase()]: YFI,
        [String('0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83').toLowerCase()]: YFII,
        [String('0xE41d2489571d322189246DaFA5ebDe1F4699F498').toLowerCase()]: ZRX
    },
    [ChainId.ROPSTEN]: {
        [String('0x443Fd8D5766169416aE42B8E050fE9422f628419').toLowerCase()]: BAT,
        [String('0x1Fe16De955718CFAb7A44605458AB023838C2793').toLowerCase()]: COMP,
        [String('0xc2118d4d90b274016cB7a54c03EF52E6c537D957').toLowerCase()]: DAI,
        [String('0xb19c7BFc9a7CbE4C35189d475725557A96bFb50A').toLowerCase()]: LINK,
        [String('0x26fF7457496600C63b3E8902C9f871E60eDec4e4').toLowerCase()]: SAI,
        [String('0x71d82Eb6A5051CfF99582F4CDf2aE9cD402A4882').toLowerCase()]: UNI,
        [String('0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C').toLowerCase()]: USDC,
        [String('0xBde8bB00A7eF67007A96945B3a3621177B615C44').toLowerCase()]: BTC,
        [String('0xc778417E063141139Fce010982780140Aa0cD5Ab').toLowerCase()]: ETH,
        [String('0xE4C6182EA459E63B8F1be7c428381994CcC2D49c').toLowerCase()]: ZRX
    },
    [ChainId.KOVAN]: {
        [String('0x482dC9bB08111CB875109B075A40881E48aE02Cd').toLowerCase()]: BAT,
        [String('0x61460874a7196d6a22D1eE4922473664b3E95270').toLowerCase()]: COMP,
        [String('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa').toLowerCase()]: DAI,
        [String('0xD1308F63823221518Ec88EB209CBaa1ac182105f').toLowerCase()]: SAI,
        [String('0xb7a4F3E9097C08dA09517b5aB877F7a917224ede').toLowerCase()]: USDC,
        [String('0x07de306FF27a2B630B1141956844eB1552B956B5').toLowerCase()]: USDT,
        [String('0xd3A691C852CDB01E281545A27064741F0B7f6825').toLowerCase()]: BTC,
        [String('0xd0A1E359811322d97991E03f863a0C30C2cF029C').toLowerCase()]: ETH,
        [String('0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3').toLowerCase()]: ZRX,
        [String('0x50DD65531676F718B018De3dc48F92B53D756996').toLowerCase()]: REP
    },
    [ChainId.BSC]: {
        [String('0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47').toLowerCase()]: ADA, // ADA
        [String('0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56').toLowerCase()]: BUSD,
        [String('0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18').toLowerCase()]: BAND,
        [String('0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf').toLowerCase()]: BTC, // BTC
        [String('0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c').toLowerCase()]: BCH, // BCH
        [String('0x55d398326f99059fF775485246999027B3197955').toLowerCase()]: USDT, // BUSDT
        [String('0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888').toLowerCase()]: CREAM,
        [String('0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3').toLowerCase()]: DAI,
        [String('0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402').toLowerCase()]: DOT, // DOT
        [String('0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6').toLowerCase()]: EOS, // EIS
        [String('0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD').toLowerCase()]: LINK,
        [String('0x4338665CBB7B2485A8855A139b75D5e34AB0DB94').toLowerCase()]: LTC, // LTC
        [String('0x47bead2563dcbf3bf2c9407fea4dc236faba485a').toLowerCase()]: SXP,
        [String('0xBf5140A22578168FD562DCcF235E5D43A02ce9B1').toLowerCase()]: UNI,
        [String('0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d').toLowerCase()]: USDC,
        [String('0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE').toLowerCase()]: XRP, // XRP
        [String('0x16939ef78684453bfDFb47825F8a5F714f12623a').toLowerCase()]: XTZ, // XTZ
        [String('0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63').toLowerCase()]: XVS, // XVS
        [String('0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e').toLowerCase()]: YFI,
        [String('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c').toLowerCase()]: BNB, // BNB
        [String('0x2170Ed0880ac9A755fd29B2688956BD959F933F8').toLowerCase()]: ETH
    },
    [ChainId.MATIC]: {
        [String('0xD6DF932A45C0f255f85145f286eA0b292B21C90B').toLowerCase()]: AAVE,
        [String('0x3D417087f8Fcacf77feb6cF40DcBc764bF2f033a').toLowerCase()]: BTC, // BTC
        [String('0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063').toLowerCase()]: DAI,
        [String('0x1E8954b2b29CC5ae4952044cF71645E61309bfCb').toLowerCase()]: ETH,
        [String('0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39').toLowerCase()]: LINK,
        [String('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270').toLowerCase()]: MATIC,
        [String('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174').toLowerCase()]: USDC,
        [String('0xc2132D05D31c914a87C6611C10748AEb04B58e8F').toLowerCase()]: USDT,
        [String('0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6').toLowerCase()]: BTC // WBTC
    },
    [ChainId.HECO]: {
        [String('0x202b4936fE1a82A4965220860aE46d7d3939Bb25').toLowerCase()]: AAVE,
        [String('0x64FF637fB478863B7468bc97D30a5bF3A428a1fD').toLowerCase()]: ETH,
        [String('0xeF3CEBD77E0C52cb6f60875d9306397B5Caca375').toLowerCase()]: BCH, // BCH
        [String('0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa').toLowerCase()]: BTC, // BTC
        [String('0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3').toLowerCase()]: DOT, // DOT
        [String('0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F').toLowerCase()]: HT, // HT
        [String('0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047').toLowerCase()]: HUSD, // HUSD
        [String('0xecb56cf772B5c9A6907FB7d32387Da2fCbfB63b4').toLowerCase()]: LTC, // LTC
        [String('0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c').toLowerCase()]: MDX, // MDX
        [String('0x777850281719d5a96C29812ab72f822E0e09F3Da').toLowerCase()]: SNX, // SNX
        [String('0x22C54cE8321A4015740eE1109D9cBc25815C46E6').toLowerCase()]: UNI,
        [String('0xa71EdC38d189767582C38A3145b5873052c3e47a').toLowerCase()]: USDT
    }
}

function getTokenIcon(address: string, chainId: ChainId = 1): string {
    const RESULT = TOKEN_ICONS[chainId][address.toLowerCase()]
    console.log('result', RESULT)
    if (!RESULT) {
        return UNKNOWN
    } else {
        return RESULT
    }
}

export default getTokenIcon
