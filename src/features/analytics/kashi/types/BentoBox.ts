import { KashiPair } from './KashiPair'
import { Token } from './Token'
import { User } from './User'

export type BentoBox = {
  id: string
  users?: User[]
  tokens?: Token[]
  kashiPairs?: KashiPair[]
  totalTokens?: BigInt
  totalKashiPairs?: BigInt
  totalUsers?: BigInt
  block?: BigInt
  timestamp?: BigInt
}
