import * as transaction from 'app/functions/transaction'

import * as SushiGuard from '../../entities/SushiGuard'

// @ponicode
describe('transaction.txMinutesPending', () => {
  test('0', () => {
    let result: any = transaction.txMinutesPending(undefined)
    expect(result).toMatchSnapshot()
  })
})

// @ponicode
describe('transaction.isTxSuccessful', () => {
  test('0', () => {
    let result: any = transaction.isTxSuccessful(undefined)
    expect(result).toMatchSnapshot()
  })
})

// @ponicode
describe('transaction.isTxPending', () => {
  test('0', () => {
    // @ts-ignore
    let result: any = transaction.isTxPending(SushiGuard.PrivateTxState)
    expect(result).toBeTruthy()
  })
})
