/**
 * @package Sushi Guard
 * @version 0.1.0
 */

/**
 * @export
 * @interface JsonRpcRequest
 */
export interface JsonRpcRequest {
  jsonrpc: '2.0'
  id: number | string | null
  method: string
  params?: unknown[] | unknown
}
/**
 *
 *
 * @export
 * @interface JsonRpcError
 */
export interface JsonRpcError {
  code: number
  message: string
  data?: unknown
}
/**
 *
 *
 * @export
 * @interface JsonRpcResponse
 * @template T
 */
export interface JsonRpcResponse<T> {
  jsonrpc: '2.0'
  id?: number | string | null
  result?: T
  error?: JsonRpcError
}
/**
 *
 *
 * @export
 * @class HttpJsonRpcError
 * @extends {Error}
 */
export class HttpJsonRpcError extends Error {
  constructor(message: string, public req?: JsonRpcRequest, public res?: Response) {
    super(message)
  }
}
/**
 *
 *
 * @export
 * @template T
 * @param {string} url
 * @param {Partial<JsonRpcRequest>} { jsonrpc = '2.0', id = new Date().getTime(), method = '', params = [] }
 * @return {(Promise<JsonRpcResponse<JsonRpcError | T>>)}
 */
export function fetchJsonRpc<T>(
  url: string,
  { jsonrpc = '2.0', id = new Date().getTime(), method = '', params = [] }: Partial<JsonRpcRequest>
): Promise<JsonRpcResponse<JsonRpcError | T>> {
  return fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ jsonrpc, id, method, params }),
  }).then((res: Response) => {
    // handle http errors (anything not 200)
    if (res.status !== 200) throw new HttpJsonRpcError(res.statusText, { jsonrpc, id, method, params }, res)

    // handle successful response
    return res.json()
  })
}

/** 
 // TODO - add this as an Async Function

 export async function fetchJsonRpc<T>(
  url: string,
  { jsonrpc = '2.0', id = new Date().getTime(), method = '', params = [] }: Partial<JsonRpcRequest>
): Promise<JsonRpcResponse<JsonRpcError | T>> {
  const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ jsonrpc, id, method, params }),
    })
    // handle http errors (anything not 200)
    if (res.status !== 200)
        throw new HttpJsonRpcError(res.statusText, { jsonrpc, id, method, params }, res)
    return await res.json()
}
*/
