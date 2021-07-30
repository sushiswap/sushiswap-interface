import { ChainId, CurrencyAmount, Token } from '@sushiswap/sdk'
import { ApprovalState } from '../../hooks'
import { BentoMasterApproveCallback, BentoPermit } from '../../hooks/useBentoMasterApproveCallback'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface Strategy {
  id: string
  general: StrategyGeneralInfo
  tokenDefinitions: StrategyTokenDefinitions
}

export interface StrategyGeneralInfo {
  name: string
  steps: string[]
  zapMethod: string
  unzapMethod: string
  description: string
  inputSymbol: string
  outputSymbol: string
}

export interface StrategyTokenDefinitions {
  inputToken: StrategyToken
  outputToken: StrategyToken
  spendToken?: StrategyToken
}

export interface StrategyToken {
  chainId: ChainId
  address: string
  decimals: number
  symbol: string
}

export interface StrategyBalances {
  inputTokenBalance: CurrencyAmount<Token>
  outputTokenBalance: CurrencyAmount<Token>
}

export interface BaseStrategyHook extends Strategy {
  execute: (val: CurrencyAmount<Token>, permit?: BentoPermit) => Promise<any>
  approveCallback: [ApprovalState, () => Promise<void>]
  getStrategy: () => Strategy
  calculateOutputFromInput: (
    zapIn: boolean,
    inputValue: string,
    inputToken: Token,
    outputToken: Token
  ) => Promise<string> | string
  balances: StrategyBalances
  setBalances: ({
    inputTokenBalance,
    outputTokenBalance,
  }: {
    inputTokenBalance?: CurrencyAmount<Token>
    outputTokenBalance?: CurrencyAmount<Token>
  }) => void
  bentoApproveCallback?: BentoMasterApproveCallback
}

export interface StrategyHook extends BaseStrategyHook {}

export interface InariState {
  id: string
  zapIn: boolean
  usesBentoBox: boolean
  inputValue: string
  outputValue: string
  general: StrategyGeneralInfo
  tokens: StrategyTokenDefinitions
}

export interface DerivedInariState extends Omit<InariState, 'inputValue' | 'outputValue' | 'tokens'> {
  inputValue: CurrencyAmount<Token>
  outputValue: CurrencyAmount<Token>
  tokens: {
    inputToken: Token
    outputToken: Token
    badgeToken?: Token
    allowanceToken?: Token
  }
}
