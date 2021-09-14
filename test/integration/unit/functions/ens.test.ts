import { parseENSAddress } from '../../../../src/functions/ens'

describe('parseENSAddress', () => {
  it('test cases', () => {
    expect(parseENSAddress('hello.eth')).to.eql({
      ensName: 'hello.eth',
      ensPath: undefined,
    })
    expect(parseENSAddress('hello.eth/')).to.eql({
      ensName: 'hello.eth',
      ensPath: '/',
    })
    expect(parseENSAddress('hello.world.eth/')).to.eql({
      ensName: 'hello.world.eth',
      ensPath: '/',
    })
    expect(parseENSAddress('hello.world.eth/abcdef')).to.eql({
      ensName: 'hello.world.eth',
      ensPath: '/abcdef',
    })
    expect(parseENSAddress('abso.lutely')).to.equal(undefined)
    expect(parseENSAddress('abso.lutely.eth')).to.eql({
      ensName: 'abso.lutely.eth',
      ensPath: undefined,
    })
    expect(parseENSAddress('eth')).to.equal(undefined)
    expect(parseENSAddress('eth/hello-world')).to.equal(undefined)
    expect(parseENSAddress('hello-world.eth')).to.eql({
      ensName: 'hello-world.eth',
      ensPath: undefined,
    })
    expect(parseENSAddress('-prefix-dash.eth')).to.equal(undefined)
    expect(parseENSAddress('suffix-dash-.eth')).to.equal(undefined)
    expect(parseENSAddress('it.eth')).to.eql({
      ensName: 'it.eth',
      ensPath: undefined,
    })
    expect(parseENSAddress('only-single--dash.eth')).to.equal(undefined)
  })
})
