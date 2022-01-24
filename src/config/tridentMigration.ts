import { ChainId } from '@sushiswap/core-sdk'

export const tridentMigrationContracts: { [key in ChainId]?: string } = {
  [ChainId.KOVAN]: '0x72a1799A36d187D273DD70D95DE0056a76af7778',
  [ChainId.MATIC]: '0xFdD3B86128d4168cfB536931C7e31E2cF4Fc004A',
}
