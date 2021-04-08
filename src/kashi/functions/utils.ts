import { BigNumber } from '@ethersproject/bignumber'

export function rpcToObj(rpc_obj: any, obj?: any) {
	if (rpc_obj instanceof BigNumber) {
		return rpc_obj
	}
	if (!obj) {
		obj = {}
	}
	if (typeof rpc_obj == 'object') {
		if (Object.keys(rpc_obj).length && isNaN(Number(Object.keys(rpc_obj)[Object.keys(rpc_obj).length - 1]))) {
			for (let i in rpc_obj) {
				if (isNaN(Number(i))) {
					obj[i] = rpcToObj(rpc_obj[i])
				}
			}
			return obj
		}
		return rpc_obj.map((item: any) => rpcToObj(item))
	}
	return rpc_obj
}
