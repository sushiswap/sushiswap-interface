import { chunkArray } from './chunkArray'
// import chunkArray from './chunkArray'

describe('#chunkArray', () => {
  it('distributes evenly', () => {
    // @ts-ignore
    expect(chunkArray([1, 2, 3])).toEqual([[1, 2, 3]])
  })
  it('takes gasLimit argument into account', () => {
    expect(chunkArray([1, 2, 3], 1)).toEqual([[1], [2], [3]])
  })
  it('handles empty array', () => {
        // @ts-ignore
    expect(chunkArray([])).toEqual([])
  })
  it('accepts objects with own gasRequired', () => {
    const items = [
      { item: 1, gasRequired: 30_000_000 },
      { item: 2, gasRequired: 40_000_000 },
      { item: 3, gasRequired: 50_000_000 },
    ]
    const [item1, item2, item3] = items
        // @ts-ignore
    expect(chunkArray(items)).toEqual([[item1, item2], [item3]])
  })
})
