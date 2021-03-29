import { BigNumber } from '@ethersproject/bignumber'

function takeFee(amount: BigNumber) {
  return amount.mul(BigNumber.from(9)).div(BigNumber.from(10))
}

export default takeFee
