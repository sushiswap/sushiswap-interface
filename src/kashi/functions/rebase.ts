import { BigNumber } from '@ethersproject/bignumber'

function rebase(value: BigNumber, from: BigNumber, to: BigNumber) {
	return from ? value.mul(to).div(from) : BigNumber.from(0)
}

export default rebase
