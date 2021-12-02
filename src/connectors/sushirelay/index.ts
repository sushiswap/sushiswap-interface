import { AbstractConnector } from '@web3-react/abstract-connector'
import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import warning from 'tiny-warning'
import { OPENMEV_METAMASK_CHAIN_ID_TO_NETWORK, OPENMEV_METAMASK_SUPPORTED_NETWORKS } from '../../config/openmev'
import { Send, SendOld, SendReturn, SendReturnResult } from './types'

function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on window.ethereum.'
  }
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class InjectedConnector extends AbstractConnector {
  constructor(kwargs: AbstractConnectorArguments) {
    super(kwargs)

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  private handleChainChanged(chainId: string | number): void {
    const newChainId = OPENMEV_METAMASK_SUPPORTED_NETWORKS.find((id) => id === chainId)
    if (newChainId) {
      chainId = OPENMEV_METAMASK_CHAIN_ID_TO_NETWORK[newChainId]
    }

    this.emitUpdate({ chainId, provider: window.ethereum })
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleClose(code: number, reason: string): void {
    this.emitDeactivate()
  }

  private handleNetworkChanged(networkId: string | number): void {
    this.emitUpdate({ chainId: networkId, provider: window.ethereum })
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    if (window.ethereum.on) {
      window.ethereum.on('chainChanged', this.handleChainChanged)
      window.ethereum.on('accountsChanged', this.handleAccountsChanged)
      window.ethereum.on('close', this.handleClose)
      window.ethereum.on('networkChanged', this.handleNetworkChanged)
    }

    if ((window.ethereum as any).isMetaMask) {
      ;(window.ethereum as any).autoRefreshOnNetworkChange = false
    }

    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await (window.ethereum.send as Send)('eth_requestAccounts').then(
        (sendReturn) => parseSendReturn(sendReturn)[0]
      )
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
    }

    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = await window.ethereum.enable().then((sendReturn) => sendReturn && parseSendReturn(sendReturn)[0])
    }

    return { provider: window.ethereum, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    return window.ethereum
  }

  public async getChainId(): Promise<number | string> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let chainId
    if (!chainId) {
      try {
        chainId = await (window.ethereum.send as Send)('net_version').then(parseSendReturn)
      } catch {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }

    if (!chainId) {
      try {
        chainId = await (window.ethereum.send as Send)('eth_chainId').then(parseSendReturn)
      } catch {
        warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
      }
    }

    if (!chainId) {
      try {
        chainId = parseSendReturn((window.ethereum.send as SendOld)({ method: 'net_version' }))
      } catch {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }

    if (!chainId) {
      if ((window.ethereum as any).isDapper) {
        chainId = parseSendReturn((window.ethereum as any).cachedResults.net_version)
      } else {
        chainId =
          (window.ethereum as any).chainId ||
          (window.ethereum as any).netVersion ||
          (window.ethereum as any).networkVersion ||
          (window.ethereum as any)._chainId
      }
    }

    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await (window.ethereum.send as Send)('eth_accounts').then(
        (sendReturn) => parseSendReturn(sendReturn)[0]
      )
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await window.ethereum.enable().then((sendReturn) => parseSendReturn(sendReturn)[0])
      } catch {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account) {
      account = parseSendReturn((window.ethereum.send as SendOld)({ method: 'eth_accounts' }))[0]
    }

    return account
  }

  public deactivate() {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('chainChanged', this.handleChainChanged)
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
      window.ethereum.removeListener('close', this.handleClose)
      window.ethereum.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  public async isAuthorized(): Promise<boolean> {
    if (!window.ethereum) {
      return false
    }

    try {
      return await (window.ethereum.send as Send)('eth_accounts').then((sendReturn) => {
        if (parseSendReturn(sendReturn).length > 0) {
          return true
        } else {
          return false
        }
      })
    } catch {
      return false
    }
  }
}
