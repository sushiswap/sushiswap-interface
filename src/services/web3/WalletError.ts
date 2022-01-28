export const USER_REJECTED_TX = 4001

/*
 * Used for Typescript try/catch error parsing. Example:
 *    if (error instanceof WalletError && error.code !== 4001) {
 *       console.error(error)
 *    }
 */
export class WalletError extends Error {
  constructor(readonly code: number, readonly message: string, readonly stack: string) {
    super()
  }
}
