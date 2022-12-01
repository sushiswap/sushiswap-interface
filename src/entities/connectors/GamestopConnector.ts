export {}
// Note (amiller68) - #MetamaskOnly - Uncomment this in order to reimplement the Gamestop connector (?) Maybe
// /* eslint-disable max-classes-per-file, @typescript-eslint/naming-convention, no-underscore-dangle, no-prototype-builtins, no-console, class-methods-use-this, prefer-destructuring, @typescript-eslint/no-explicit-any, no-magic-numbers */
// /*
//  * Do not add any new eslint suppressions above.
//  * Consider removing the above suppressions when making major edits to this file.
//  * (This file was first authored before we used eslint.)
//  */
// import { AbstractConnector } from '@web3-react/abstract-connector'
// import warning from 'tiny-warning'

// export type SendReturnResult = { result: any }
// export type SendReturn = any

// export type Send = (method: string, params?: any[]) => Promise<SendReturnResult | SendReturn>
// export type SendOld = ({ method }: { method: string }) => Promise<SendReturnResult | SendReturn>

// export interface AbstractConnectorArguments {
//   supportedChainIds?: number[]
// }

// export interface ConnectorUpdate<T = number | string> {
//   provider?: any
//   chainId?: T
//   account?: null | string
// }

// function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
//   return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
// }

// export class NoEthereumProviderError extends Error {
//   public constructor() {
//     super()
//     this.name = this.constructor.name
//     this.message = 'No Ethereum provider was found on window.gamestop.'
//   }
// }

// export class UserRejectedRequestError extends Error {
//   public constructor() {
//     super()
//     this.name = this.constructor.name
//     this.message = 'The user rejected the request.'
//   }
// }

// export class GamestopConnector extends AbstractConnector {
//   constructor(kwargs: AbstractConnectorArguments) {
//     super(kwargs)

//     this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
//     this.handleChainChanged = this.handleChainChanged.bind(this)
//     this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
//     this.handleClose = this.handleClose.bind(this)
//   }

//   private handleChainChanged(chainId: string | number): void {
//     this.emitUpdate({ chainId, provider: window.gamestop })
//   }

//   private handleAccountsChanged(accounts: string[]): void {
//     if (accounts.length === 0) {
//       this.emitDeactivate()
//     } else {
//       this.emitUpdate({ account: accounts[0] })
//     }
//   }

//   private handleClose(code: number, reason: string): void {
//     this.emitDeactivate()
//   }

//   private handleNetworkChanged(networkId: string | number): void {
//     this.emitUpdate({ chainId: networkId, provider: window.gamestop })
//   }

//   public async activate(): Promise<ConnectorUpdate> {
//     if (!window.gamestop) {
//       throw new NoEthereumProviderError()
//     }

//     if (window.gamestop.on) {
//       window.gamestop.on('chainChanged', this.handleChainChanged)
//       window.gamestop.on('accountsChanged', this.handleAccountsChanged)
//       window.gamestop.on('close', this.handleClose)
//       window.gamestop.on('networkChanged', this.handleNetworkChanged)
//     }

//     // try to activate + get account via eth_requestAccounts
//     let account
//     try {
//       account = await (window.gamestop.send as Send)('eth_requestAccounts').then(
//         (sendReturn: any) => parseSendReturn(sendReturn)[0]
//       )
//     } catch (error) {
//       if ((error as any).code === 4001) {
//         throw new UserRejectedRequestError()
//       }
//       warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
//     }

//     // if unsuccessful, try enable
//     if (!account) {
//       // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
//       account = await window.gamestop.enable().then((sendReturn: any) => sendReturn && parseSendReturn(sendReturn)[0])
//     }

//     return { provider: window.gamestop, ...(account ? { account } : {}) }
//   }

//   public async getProvider(): Promise<any> {
//     return window.gamestop
//   }

//   public async getChainId(): Promise<number | string> {
//     if (!window.gamestop) {
//       throw new NoEthereumProviderError()
//     }

//     let chainId
//     try {
//       chainId = await (window.gamestop.send as Send)('eth_chainId').then(parseSendReturn)
//     } catch {
//       warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
//     }

//     if (!chainId) {
//       try {
//         chainId = await (window.gamestop.send as Send)('net_version').then(parseSendReturn)
//       } catch {
//         warning(false, 'net_version was unsuccessful, falling back to net version v2')
//       }
//     }

//     if (!chainId) {
//       try {
//         chainId = parseSendReturn((window.gamestop.send as SendOld)({ method: 'net_version' }))
//       } catch {
//         warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
//       }
//     }

//     if (!chainId) {
//       if ((window.gamestop as any).isDapper) {
//         chainId = parseSendReturn((window.gamestop as any).cachedResults.net_version)
//       } else {
//         chainId =
//           (window.gamestop as any).chainId ||
//           (window.gamestop as any).netVersion ||
//           (window.gamestop as any).networkVersion ||
//           (window.gamestop as any)._chainId
//       }
//     }

//     return chainId
//   }

//   public async getAccount(): Promise<null | string> {
//     if (!window.gamestop) {
//       throw new NoEthereumProviderError()
//     }

//     let account
//     try {
//       account = await (window.gamestop.send as Send)('eth_accounts').then(
//         (sendReturn: any) => parseSendReturn(sendReturn)[0]
//       )
//     } catch {
//       warning(false, 'eth_accounts was unsuccessful, falling back to enable')
//     }

//     if (!account) {
//       try {
//         account = await window.gamestop.enable().then((sendReturn: any) => parseSendReturn(sendReturn)[0])
//       } catch {
//         warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
//       }
//     }

//     if (!account) {
//       account = parseSendReturn((window.gamestop.send as SendOld)({ method: 'eth_accounts' }))[0]
//     }

//     return account
//   }

//   public deactivate() {
//     if (window.gamestop && window.gamestop.removeListener) {
//       window.gamestop.removeListener('chainChanged', this.handleChainChanged)
//       window.gamestop.removeListener('accountsChanged', this.handleAccountsChanged)
//       window.gamestop.removeListener('close', this.handleClose)
//       window.gamestop.removeListener('networkChanged', this.handleNetworkChanged)
//     }
//   }

//   public async isAuthorized(): Promise<boolean> {
//     if (!window.gamestop) {
//       return false
//     }

//     try {
//       return await (window.gamestop.send as Send)('eth_accounts').then((sendReturn) => {
//         if (parseSendReturn(sendReturn).length > 0) {
//           return true
//         } else {
//           return false
//         }
//       })
//     } catch {
//       return false
//     }
//   }
// }
