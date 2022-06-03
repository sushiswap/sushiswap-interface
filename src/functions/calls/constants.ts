
import type { CallResult, CallState, ListenerOptions } from './types'

/** @note EIP4488 Pisa post-merge */
export const FUTURE_EIP4488 = 1_048_576
export const DEFAULT_CALL_GAS_REQUIRED = 1_000_000
export const DEFAULT_CHUNK_GAS_REQUIRED = 200_000
export const CHUNK_GAS_LIMIT = 100_000_000
export const CONSERVATIVE_BLOCK_GAS_LIMIT = 10_000_000
/** @note Minimum the gas limit may ever be, in Golang uint64 */
export const MIN_GAS_LIMIT = 5000 
/** @note Maximum the gas limit (2^63-1), in Golang uint64 */
export const MAX_GAS_LIMIT = 0x7fffffffffffffff 
/** 
 * @summary Const for hooks 
 * @export INVALID_RESULT
 * @export NEVER_RELOAD
 */
export const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined }
export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
}

/** @export INVALID_CALL_STATE */
export const INVALID_CALL_STATE: CallState = {
  valid: false,
  result: undefined,
  loading: false,
  syncing: false,
  error: false,
}

/** @export LOADING_CALL_STATE */
export const LOADING_CALL_STATE: CallState = {
  valid: true,
  result: undefined,
  loading: true,
  syncing: true,
  error: false,
}
