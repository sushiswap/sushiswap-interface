import { ChainId } from '@sushiswap/core-sdk'

export const tridentMigrationContracts: { [key in ChainId]?: string } = {
  [ChainId.KOVAN]: '0x6f09da34EC699339f18AF9Dc2cDB5C4F69A5Ccd0',
  [ChainId.MATIC]: '0xFdD3B86128d4168cfB536931C7e31E2cF4Fc004A',
}
