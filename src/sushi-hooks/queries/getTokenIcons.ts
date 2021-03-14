// todo: move these into sushiswap/assets/square
import BAT from '../../assets/kashi/tokens/bat-square.png'
import COMP from '../../assets/kashi/tokens/comp-square.png'
import DAI from '../../assets/kashi/tokens/dai-square.png'
import LINK from '../../assets/kashi/tokens/link-square.png'
import UNI from '../../assets/kashi/tokens/uni-square.png'
import USDC from '../../assets/kashi/tokens/usdc-square.png'
import WBTC from '../../assets/kashi/tokens/wbtc-square.png'
import WETH from '../../assets/kashi/tokens/eth-square.png'
import ZRX from '../../assets/kashi/tokens/zrx-square.png'

import UNKNOWN from '../../assets/kashi/tokens/unknown.png'

const TOKEN_ICONS = {
  //ROPSTEN
  [String('0x443Fd8D5766169416aE42B8E050fE9422f628419').toLowerCase()]: BAT,
  [String('0x1Fe16De955718CFAb7A44605458AB023838C2793').toLowerCase()]: COMP,
  [String('0xc2118d4d90b274016cB7a54c03EF52E6c537D957').toLowerCase()]: DAI,
  [String('0xb19c7BFc9a7CbE4C35189d475725557A96bFb50A').toLowerCase()]: LINK,
  [String('0x71d82Eb6A5051CfF99582F4CDf2aE9cD402A4882').toLowerCase()]: UNI,
  [String('0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C').toLowerCase()]: USDC,
  [String('0xBde8bB00A7eF67007A96945B3a3621177B615C44').toLowerCase()]: WBTC,
  [String('0xc778417E063141139Fce010982780140Aa0cD5Ab').toLowerCase()]: WETH,
  [String('0xE4C6182EA459E63B8F1be7c428381994CcC2D49c').toLowerCase()]: ZRX
}

const getOracleName = (address: string) => {
  const RESULT = TOKEN_ICONS[address.toLowerCase()]
  if (!RESULT) {
    return UNKNOWN
  } else {
    return RESULT
  }
}

export default getOracleName
