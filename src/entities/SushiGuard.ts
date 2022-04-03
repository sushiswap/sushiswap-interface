import { JsonRpcResponse } from 'lib/jsonrpc'

/**
 * @export PrivateTxStatus
 * @version 2022.03.29
 *   Basic explanation of the tx state types:
 *
 * - UNCHECKED -> Tx status has not been checked and there's no information about it.
 * - PROCESSING -> Tx checks are in place until a resolution happens: OK, INDETERMINATE, ERROR.
 * - OK -> Relay received the Tx && all downstream miners accepted without complains && tx mined successfully
 * - INDETERMINATE -> Relay received correctly the Tx && at least one miner accepted the TX && TX potentially mineable
 * - ERROR -> Relay hasen't received the TX || none of the miners accepted the Tx || Tx was not mined successfully
 *
 */
export enum PrivateTxState {
  UNCHECKED = 'UNCHECKED',
  PROCESSING = 'PROCESSING',
  OK = 'OK',
  INDETERMINATE = 'INDETERMINATE',
  ERROR = 'ERROR',
}

export type RelayResponses = Record<string, RelayResponse>

export interface RelayResponse {
  response: JsonRpcResponse<any>
  error?: string
}

/**
 * @interface PrivateTxStatus
 * @summary an object that holds the transaction hash, the time it was received, the time it was relayed, the time it was mined and the relay responses.
 */
export interface PrivateTxStatus {
  transactionHash: string
  receivedAt: string // TODO: change to type Date / Unix Timestamp
  relayedAt?: string // TODO: change to type Date / Unix Timestamp
  minedAt?: string
  relayFailure?: boolean
  relayResponses?: RelayResponses
}
