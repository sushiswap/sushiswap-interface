import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'

// todo: move these into sushiswap/assets/square
import INCH from '../../assets/kashi/tokens/1inch-square.jpg'
import AAVE from '../../assets/kashi/tokens/aave-square.jpg'
import BAND from '../../assets/kashi/tokens/band-square.jpg'
import BAT from '../../assets/kashi/tokens/bat-square.jpg'
// import BNB from '../../assets/kashi/tokens/bnb-square.jpg'
import BUSD from '../../assets/kashi/tokens/busd-square.jpg'
// import BCH from '../../assets/kashi/tokens/bch-square.jpg'
import BTC from '../../assets/kashi/tokens/btc-square.jpg'
import COMP from '../../assets/kashi/tokens/comp-square.jpg'
import COVER from '../../assets/kashi/tokens/cover-square.jpg'
import CREAM from '../../assets/kashi/tokens/cream-square.jpg'
import DAI from '../../assets/kashi/tokens/dai-square.jpg'
// import DOT from '../../assets/kashi/tokens/dot-square.jpg'
// import EOS from '../../assets/kashi/tokens/eos-square.jpg'
import ETH from '../../assets/kashi/tokens/eth-square.jpg'
// import HT from '../../assets/kashi/tokens/heco-square.jpg'
// import HUSD from '../../assets/kashi/tokens/husd-square.jpg'
import LINK from '../../assets/kashi/tokens/link-square.jpg'
// import LTC from '../../assets/kashi/tokens/ltc-square.jpg'
import MATIC from '../../assets/kashi/tokens/matic-square.jpg'
// import MDX from '../../assets/kashi/tokens/mdx-square.jpg'
import REP from '../../assets/kashi/tokens/repv2-square.jpg'
import SAI from '../../assets/kashi/tokens/sai-square.png'
import SNX from '../../assets/kashi/tokens/snx-square.png'
import SUSHI from '../../assets/kashi/tokens/sushi-square.jpg'
import SXP from '../../assets/kashi/tokens/sxp-square.jpg'
import UNI from '../../assets/kashi/tokens/uni-square.jpg'
import USDC from '../../assets/kashi/tokens/usdc-square.jpg'
import USDT from '../../assets/kashi/tokens/usdt-square.jpg'
// import XRP from '../../assets/kashi/tokens/xrp-square.jpg'
// import XVS from '../../assets/kashi/tokens/xvs-square.jpg'
// import XTZ from '../../assets/kashi/tokens/xtz-square.jpg'
import YFI from '../../assets/kashi/tokens/yfi-square.jpg'
import ZRX from '../../assets/kashi/tokens/zrx-square.jpg'

import UNKNOWN from '../../assets/kashi/tokens/unknown.png'

const TOKEN_ICONS: { [chainId in ChainId]?: any } = {
  [ChainId.MAINNET]: {
    [String('0x111111111117dC0aa78b770fA6A738034120C302').toLowerCase()]: INCH,
    [String('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9').toLowerCase()]: AAVE,
    [String('0xc00e94Cb662C3520282E6f5717214004A7f26888').toLowerCase()]: COMP,
    [String('0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713').toLowerCase()]: COVER,
    [String('0x6B175474E89094C44Da98b954EedeAC495271d0F').toLowerCase()]: DAI,
    [String('0x514910771AF9Ca656af840dff83E8264EcF986CA').toLowerCase()]: LINK,
    [String('0x6B3595068778DD592e39A122f4f5a5cF09C90fE2').toLowerCase()]: SUSHI,
    [String('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984').toLowerCase()]: UNI,
    [String('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48').toLowerCase()]: USDC,
    [String('0xdAC17F958D2ee523a2206206994597C13D831ec7').toLowerCase()]: USDT,
    [String('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599').toLowerCase()]: BTC,
    [String('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2').toLowerCase()]: ETH,
    [String('0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e').toLowerCase()]: YFI
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
    [String('0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47').toLowerCase()]: UNKNOWN, // ADA
    [String('0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56').toLowerCase()]: BUSD,
    [String('0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18').toLowerCase()]: BAND,
    [String('0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf').toLowerCase()]: BTC, // BTC
    [String('0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c').toLowerCase()]: UNKNOWN, // BCH
    [String('0x55d398326f99059fF775485246999027B3197955').toLowerCase()]: UNKNOWN, // BUSDT
    [String('0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888').toLowerCase()]: CREAM,
    [String('0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3').toLowerCase()]: DAI,
    [String('0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402').toLowerCase()]: UNKNOWN, // DOT
    [String('0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6').toLowerCase()]: UNKNOWN, // EIS
    [String('0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD').toLowerCase()]: LINK,
    [String('0x4338665CBB7B2485A8855A139b75D5e34AB0DB94').toLowerCase()]: UNKNOWN, // LTC
    [String('0x47bead2563dcbf3bf2c9407fea4dc236faba485a').toLowerCase()]: SXP,
    [String('0xBf5140A22578168FD562DCcF235E5D43A02ce9B1').toLowerCase()]: UNI,
    [String('0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d').toLowerCase()]: USDC,
    [String('0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE').toLowerCase()]: UNKNOWN, // XRP
    [String('0x16939ef78684453bfDFb47825F8a5F714f12623a').toLowerCase()]: UNKNOWN, // XTZ
    [String('0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63').toLowerCase()]: UNKNOWN, // XVS
    [String('0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e').toLowerCase()]: YFI,
    [String('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c').toLowerCase()]: UNKNOWN, // BNB
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
    [String('0xeF3CEBD77E0C52cb6f60875d9306397B5Caca375').toLowerCase()]: UNKNOWN, // BCH
    [String('0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa').toLowerCase()]: BTC, // BTC
    [String('0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3').toLowerCase()]: UNKNOWN, // DOT
    [String('0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F').toLowerCase()]: UNKNOWN, // HT
    [String('0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047').toLowerCase()]: UNKNOWN, // HUSD
    [String('0xecb56cf772B5c9A6907FB7d32387Da2fCbfB63b4').toLowerCase()]: UNKNOWN, // LTC
    [String('0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c').toLowerCase()]: UNKNOWN, // MDX
    [String('0x777850281719d5a96C29812ab72f822E0e09F3Da').toLowerCase()]: SNX, // SNX
    [String('0x22C54cE8321A4015740eE1109D9cBc25815C46E6').toLowerCase()]: UNI,
    [String('0xa71EdC38d189767582C38A3145b5873052c3e47a').toLowerCase()]: USDT
  }
}

const TokenIcon = (address: string) => {
  const { chainId } = useActiveWeb3React()
  const RESULT = TOKEN_ICONS[chainId || 1][address.toLowerCase()]

  if (!RESULT) {
    return UNKNOWN
  } else {
    return RESULT
  }
}

export default TokenIcon
