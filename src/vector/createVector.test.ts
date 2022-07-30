import { createVector } from './createVector.js'

describe('insertions', () => {
  it('inserts first', () => {
    let vector = createVector<number>()
    vector.insert(1)
    expect(vector.getValue()).toEqual([1])
  })
  it('appends second', () => {
    let vector = createVector<number>()
    vector.insert(1)
    vector.insert(2)
    expect(vector.getValue()).toEqual([1, 2])
  })
  it('throws when index is out of range', () => {
    let vector = createVector<number>()
    expect(() => {
      vector.insert(1, 1)
    }).toThrow('Vector: index out of range')
  })
  it('prepends second', () => {
    let vector = createVector<number>()
    vector.insert(1)
    vector.insert(2, 0)
    expect(vector.getValue()).toEqual([2, 1])
  })
})

describe('deletions', () => {
  it('throws when index is out of range', () => {
    let vector = createVector<number>()
    expect(() => {
      vector.delete(1)
    }).toThrow('Vector: index out of range')
  })
  it('deletes', () => {
    let vector = createVector<number>()
    vector.insert(1)
    vector.insert(2)
    vector.insert(3)

    expect(vector.getValue()).toEqual([1, 2, 3])

    vector.delete(2)
    expect(vector.getValue()).toEqual([1, 2])

    vector.delete(1)
    expect(vector.getValue()).toEqual([1])

    vector.delete(0)
    expect(vector.getValue()).toEqual([])
  })
})
