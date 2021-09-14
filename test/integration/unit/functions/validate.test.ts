import { isAddress } from '../../../../src/functions/validate'

describe('#isAddress', () => {
  it('returns false if not', () => {
    expect(isAddress('')).to.be.false
    expect(isAddress('0x0000')).to.be.false
    expect(isAddress(1)).to.be.false
    expect(isAddress({})).to.be.false
    expect(isAddress(undefined)).to.be.false
  })

  it('returns the checksummed address', () => {
    expect(isAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a')).to.equal(
      '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
    )
    expect(isAddress('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')).to.equal(
      '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
    )
  })

  it('succeeds even without prefix', () => {
    expect(isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a')).to.equal('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')
  })
  it('fails if too long', () => {
    expect(isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a0')).to.be.false
  })
})
