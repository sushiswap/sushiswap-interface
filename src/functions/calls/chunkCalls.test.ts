import chunkCalls from './chunkCalls'

describe(chunkCalls, () => {
  it('each is too large', () => {
    expect(chunkCalls([{ gasRequired: 300 }, { gasRequired: 200 }, { gasRequired: 300 }], 400)).toEqual([
      [{ gasRequired: 300 }],
      [{ gasRequired: 300 }],
      [{ gasRequired: 200 }],
    ])
  })

  it('min bins simple case', () => {
    expect(chunkCalls([{ gasRequired: 100 }, { gasRequired: 200 }, { gasRequired: 300 }], 400)).toEqual([
      [{ gasRequired: 300 }, { gasRequired: 100 }],
      [{ gasRequired: 200 }],
    ])
  })

  it('all items fit', () => {
    expect(chunkCalls([{ gasRequired: 300 }, { gasRequired: 200 }, { gasRequired: 100 }], 600)).toEqual([
      [{ gasRequired: 300 }, { gasRequired: 200 }, { gasRequired: 100 }],
    ])
  })

  it('one item too large', () => {
    expect(chunkCalls([{ gasRequired: 400 }, { gasRequired: 200 }, { gasRequired: 100 }], 300)).toEqual([
      [{ gasRequired: 400 }],
      [{ gasRequired: 200 }, { gasRequired: 100 }],
    ])
  })

  it('several items too large', () => {
    expect(
      chunkCalls(
        [{ gasRequired: 200 }, { gasRequired: 100 }, { gasRequired: 400 }, { gasRequired: 400 }, { gasRequired: 400 }],
        300
      )
    ).toEqual([
      [{ gasRequired: 400 }],
      [{ gasRequired: 400 }],
      [{ gasRequired: 400 }],
      [{ gasRequired: 200 }, { gasRequired: 100 }],
    ])
  })
})
