import { t } from '@lingui/macro'
import { CREAM, SUSHI, XSUSHI } from '../../constants'
import { ChainId } from '@sushiswap/sdk'

// TODO ChainId used here
export const INARI_STRATEGIES = {
  '0': {
    name: 'SUSHI → Bento',
    steps: ['SUSHI', 'xSUSHI', 'BentoBox'],
    description: t`Stake SUSHI for xSUSHI and deposit into BentoBox in one click. xSUSHI in BentoBox is automatically
                invested into a passive yield strategy, and can be lent or used as collateral for borrowing in Kashi.`,
    inputToken: SUSHI[ChainId.MAINNET],
    outputToken: XSUSHI,
    outputSymbol: 'xSUSHI in BentoBox',
    zapMethod: 'stakeSushiToBento',
    unzapMethod: 'unstakeSushiFromBento',
  },
  '1': {
    name: 'SUSHI → Cream',
    steps: ['SUSHI', 'xSUSHI', 'Cream'],
    description: t`TODO`,
    inputToken: SUSHI[ChainId.MAINNET],
    outputToken: XSUSHI,
    outputSymbol: 'xSUSHI in Cream',
    zapMethod: 'stakeSushiToCream',
    unzapMethod: 'unstakeSushiFromCream',
  },
  '2': {
    name: 'Cream → Bento',
    steps: ['SUSHI', 'crSUSHI', 'BentoBox'],
    description: t`TODO`,
    inputToken: SUSHI[ChainId.MAINNET],
    outputToken: CREAM,
    outputSymbol: 'crSUSHI in BentoBox',
    zapMethod: 'stakeSushiToCreamToBento',
    unzapMethod: 'unstakeSushiFromCreamFromBento',
  },
  '3': {
    name: 'SUSHI → Aave',
    steps: ['SUSHI', 'xSUSHI', 'Aave'],
    description: t`TODO`,
    inputToken: SUSHI[ChainId.MAINNET],
    outputToken: XSUSHI,
    outputSymbol: 'xSUSHI in Aave',
    zapMethod: 'stakeSushiToAave',
    unzapMethod: 'unstakeSushiFromAave',
  },
}
