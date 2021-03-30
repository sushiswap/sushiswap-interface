import { AccrueInfo } from '../entities'
import { BigNumber } from '@ethersproject/bignumber'

function accrue(accrueInfo: AccrueInfo, amount: BigNumber) {
  return amount
    .mul(
      accrueInfo.interestPerSecond.mul(
        BigNumber.from(Date.now())
          .div(BigNumber.from(1000))
          .sub(accrueInfo.lastAccrued)
      )
    )
    .div(BigNumber.from('1000000000000000000'))
}

export default accrue
