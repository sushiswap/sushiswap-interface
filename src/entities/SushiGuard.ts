import { JsonRpcResponse } from 'lib/jsonrpc'

/**
 *   @enum PrivateTxState
  *  @interface PrivateTxStatus
  *  @interface RelayResponse
  *  @description Transaction State Types
 *
 * - UNCHECKED -> Tx status has not been checked and there's no information about it.
 * - PROCESSING -> Tx checks are in place until a resolution happens: OK, INDETERMINATE, ERROR.
 * - OK -> Relay received the Tx && all downstream miners accepted without complains && tx mined successfully
 * - INDETERMINATE -> Relay received correctly the Tx && at least one miner accepted the TX && TX potentially mineable
 * - ERROR -> Relay haven't received the TX || none of the miners accepted the Tx || Tx was not mined successfully
 *
/**
 * 
 *
 * @export
 * @enum {number}
 */
export enum PrivateTxState {
  UNCHECKED = 'UNCHECKED',
  PROCESSING = 'PROCESSING',
  OK = 'OK',
  INDETERMINATE = 'INDETERMINATE',
  ERROR = 'ERROR',
}

/** @type RelayResponses  */
export type RelayResponses = Record<string, RelayResponse>

/**
 *
 * @export
 * @interface RelayResponse
 */
export interface RelayResponse {
  response: JsonRpcResponse<any>
  error?: string
}

/**
 *
 * @export
 * @interface PrivateTxStatus
 */
export interface PrivateTxStatus {
  transactionHash: string
  receivedAt: string
  relayedAt?: string
  minedAt?: string
  relayFailure?: boolean
  relayResponses?: RelayResponses
}
/**
 *
 *
 * @export
 * @param {*} privateTx
 * @return {*}
 */
export function privateTx(privateTx: any): any {
  throw new Error('[#sushiguard]: Function Error.')
}
