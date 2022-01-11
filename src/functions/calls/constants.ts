import type { CallResult, CallState, ListenerOptions } from './types'

export const DEFAULT_CALL_GAS_REQUIRED = 1_000_000
export const DEFAULT_CHUNK_GAS_REQUIRED = 200_000
export const CHUNK_GAS_LIMIT = 100_000_000
export const CONSERVATIVE_BLOCK_GAS_LIMIT = 10_000_000 // conservative, hard-coded estimate of the current block gas limit

// Const for hooks
export const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined }
export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
}

export const INVALID_CALL_STATE: CallState = {
  valid: false,
  result: undefined,
  loading: false,
  syncing: false,
  error: false,
}
export const LOADING_CALL_STATE: CallState = {
  valid: true,
  result: undefined,
  loading: true,
  syncing: true,
  error: false,
}
