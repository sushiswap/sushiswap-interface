import { RetryableError, retry } from '../../../../src/functions/retry'

describe('retry', () => {
  function makeFn<T>(fails: number, result: T, retryable = true): () => Promise<T> {
    return async () => {
      if (fails > 0) {
        fails--
        throw retryable ? new RetryableError('failure') : new Error('bad failure')
      }
      return result
    }
  }

  it('fails for non-retryable error', async () => {
    retry(makeFn(1, 'abc', false), { n: 3, maxWait: 0, minWait: 0 }).promise.catch((err) =>
      expect(err.message).to.equal('bad failure')
    )
  })

  it('works after one fail', async () => {
    retry(makeFn(1, 'abc'), { n: 3, maxWait: 0, minWait: 0 }).promise.then((res) => expect(res).to.equal('abc'))
  })

  it('works after two fails', async () => {
    retry(makeFn(2, 'abc'), { n: 3, maxWait: 0, minWait: 0 }).promise.then((res) => expect(res).to.equal('abc'))
  })

  it('throws if too many fails', async () => {
    retry(makeFn(4, 'abc'), { n: 3, maxWait: 0, minWait: 0 }).promise.catch((err) =>
      expect(err.message).to.equal('failure')
    )
  })

  it('cancel causes promise to reject', async () => {
    const { promise, cancel } = retry(makeFn(2, 'abc'), {
      n: 3,
      minWait: 100,
      maxWait: 100,
    })
    cancel()
    promise.catch((err) => expect(err.message).to.equal('Cancelled'))
  })

  it('cancel no-op after complete', async () => {
    const { promise, cancel } = retry(makeFn(0, 'abc'), {
      n: 3,
      minWait: 100,
      maxWait: 100,
    })
    // defer
    setTimeout(cancel, 0)
    promise.then((res) => expect(res).to.equal('abc'))
  })

  async function checkTime(fn: () => Promise<any>, min: number, max: number) {
    const time = new Date().getTime()
    await fn()
    const diff = new Date().getTime() - time
    expect(diff >= min).to.be.true
    expect(diff <= max).to.be.true
  }

  it('waits random amount of time between min and max', async () => {
    const promises = []
    for (let i = 0; i < 10; i++) {
      promises.push(
        checkTime(
          () =>
            retry(makeFn(4, 'abc'), {
              n: 3,
              maxWait: 100,
              minWait: 50,
            }).promise.catch((err) => expect(err.message).to.equal('failure')),
          150,
          400
        )
      )
    }
    await Promise.all(promises)
  })
})
