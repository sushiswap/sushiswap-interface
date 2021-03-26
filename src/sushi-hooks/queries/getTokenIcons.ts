import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'

// todo: move these into sushiswap/assets/square
import AAVE from '../../assets/kashi/tokens/aave-square.png'
import BAT from '../../assets/kashi/tokens/bat-square.png'
import COMP from '../../assets/kashi/tokens/comp-square.png'
import DAI from '../../assets/kashi/tokens/dai-square.png'
import LINK from '../../assets/kashi/tokens/link-square.png'
import SAI from '../../assets/kashi/tokens/sai-square.png'
import SUSHI from '../../assets/kashi/tokens/sushi-square.png'
import UNI from '../../assets/kashi/tokens/uni-square.png'
import USDC from '../../assets/kashi/tokens/usdc-square.png'
import USDT from '../../assets/kashi/tokens/usdt-square.png'
import WBTC from '../../assets/kashi/tokens/wbtc-square.png'
import WETH from '../../assets/kashi/tokens/eth-square.png'
import YFI from '../../assets/kashi/tokens/yfi-square.png'
import ZRX from '../../assets/kashi/tokens/zrx-square.png'

import UNKNOWN from '../../assets/kashi/tokens/unknown.png'

const TOKEN_ICONS: { [chainId in ChainId]?: any } = {
  [ChainId.MAINNET]: {
    [String('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9').toLowerCase()]: AAVE,
    [String('0xc00e94Cb662C3520282E6f5717214004A7f26888').toLowerCase()]: COMP,
    [String('0x6B175474E89094C44Da98b954EedeAC495271d0F').toLowerCase()]: DAI,
    [String('0x514910771AF9Ca656af840dff83E8264EcF986CA').toLowerCase()]: LINK,
    [String('0x6B3595068778DD592e39A122f4f5a5cF09C90fE2').toLowerCase()]: SUSHI,
    [String('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984').toLowerCase()]: UNI,
    [String('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48').toLowerCase()]: USDC,
    [String('0xdAC17F958D2ee523a2206206994597C13D831ec7').toLowerCase()]: USDT,
    [String('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599').toLowerCase()]: WBTC,
    [String('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2').toLowerCase()]: WETH,
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
    [String('0xBde8bB00A7eF67007A96945B3a3621177B615C44').toLowerCase()]: WBTC,
    [String('0xc778417E063141139Fce010982780140Aa0cD5Ab').toLowerCase()]: WETH,
    [String('0xE4C6182EA459E63B8F1be7c428381994CcC2D49c').toLowerCase()]: ZRX
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
