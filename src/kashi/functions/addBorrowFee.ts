import { BigNumber } from '@ethersproject/bignumber'

function addBorrowFee(amount: BigNumber) {
  return amount.mul(BigNumber.from(10005)).div(BigNumber.from(10000))
}

export default addBorrowFee
