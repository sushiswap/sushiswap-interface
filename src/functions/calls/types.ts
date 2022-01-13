export interface Call {
  address: string
  callData: string
  gasRequired?: number
}

export interface CallStateResult extends ReadonlyArray<any> {
  readonly [key: string]: any
}

export interface CallState {
  readonly valid: boolean
  // the result, or undefined if loading or errored/no data
  readonly result: CallStateResult | undefined
  // true if the result has never been fetched
  readonly loading: boolean
  // true if the result is not for the latest block
  readonly syncing: boolean
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean
}

export interface CallResult {
  readonly valid: boolean
  readonly data: string | undefined
  readonly blockNumber: number | undefined
}

export interface MulticallState {
  callListeners?: {
    // on a per-chain basis
    [chainId: number]: {
      // stores for each call key the listeners' preferences
      [callKey: string]: {
        // stores how many listeners there are per each blocks per fetch preference
        [blocksPerFetch: number]: number
      }
    }
  }

  callResults: {
    [chainId: number]: {
      [callKey: string]: {
        data?: string | null
        blockNumber?: number
        fetchingBlockNumber?: number
      }
    }
  }
}

export interface WithMulticallState {
  [path: string]: MulticallState
}

export interface ListenerOptions {
  // how often this data should be fetched, by default 1
  readonly blocksPerFetch: number
}

export interface ListenerOptionsWithGas extends ListenerOptions {
  readonly gasRequired?: number
}

export interface MulticallListenerPayload {
  chainId: number
  calls: Call[]
  options: ListenerOptions
}

export interface MulticallFetchingPayload {
  chainId: number
  calls: Call[]
  fetchingBlockNumber: number
}

export interface MulticallResultsPayload {
  chainId: number
  blockNumber: number
  results: {
    [callKey: string]: string | null
  }
}
