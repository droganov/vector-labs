import {
  createVector,
  VectorInsertedOperation,
  VectorRemoteOperation,
} from './createVector.js'

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

describe('conflicts', () => {
  it('resolves concurrency', () => {
    let vector = createVector<string>()

    vector.syncronize({
      id: 'a',
      insertBefore: null,
      time: 1,
      type: 'vector/insert',
      payload: 'a',
    })
    expect(vector.getValue()).toEqual(['a'])

    vector.syncronize({
      id: 'b',
      insertBefore: 'a',
      time: 2,
      type: 'vector/insert',
      payload: 'b',
    })
    expect(vector.getValue()).toEqual(['b', 'a'])

    vector.syncronize({
      id: 'a',
      type: 'logux/undo',
    })
    expect(vector.getValue()).toEqual(['b'])

    vector.syncronize({
      id: 'b',
      type: 'logux/processed',
    })
    expect(vector.getValue()).toEqual(['b'])

    vector.syncronize({
      id: 'c',
      insertBefore: 'a',
      time: 3,
      type: 'vector/inserted',
      payload: 'c',
    })
    expect(vector.getValue()).toEqual(['b', 'c'])

    vector.syncronize({
      id: 'd',
      insertBefore: 'a',
      time: 1.5,
      type: 'vector/inserted',
      payload: 'd',
    })
    expect(vector.getValue()).toEqual(['d', 'b', 'c'])

    vector.syncronize({
      id: 'e',
      operationId: 'b',
      time: 4,
      type: 'vector/deleted',
    })
    expect(vector.getValue()).toEqual(['d', 'c'])
  })

  it('solves a > b', () => {
    let a = createVector<string>()
    let b = createVector<string>()

    a.syncronize({
      id: 'a',
      insertBefore: null,
      time: 1,
      type: 'vector/insert',
      payload: 'a',
    })
    b.syncronize({
      id: 'b',
      insertBefore: null,
      time: 2,
      type: 'vector/insert',
      payload: 'b',
    })

    a.syncronize({
      id: 'a',
      type: 'logux/processed',
    })
    b.syncronize({
      id: 'b',
      type: 'logux/processed',
    })

    a.syncronize({
      id: 'b',
      insertBefore: null,
      time: 2,
      type: 'vector/inserted',
      payload: 'b',
    })
    b.syncronize({
      id: 'a',
      insertBefore: null,
      time: 1,
      type: 'vector/inserted',
      payload: 'a',
    })

    expect(a.getValue()).toEqual(['a', 'b'])
    expect(b.getValue()).toEqual(['a', 'b'])
  })

  it('solves b > c > a', () => {
    let a = createVector<string>()
    let b = createVector<string>()

    a.syncronize({
      id: 'a',
      insertBefore: null,
      time: 1,
      type: 'vector/insert',
      payload: 'a',
    })
    a.syncronize({
      id: 'a',
      type: 'logux/processed',
    })
    b.syncronize({
      id: 'a',
      insertBefore: null,
      time: 1,
      type: 'vector/inserted',
      payload: 'a',
    })

    b.syncronize({
      id: 'b',
      insertBefore: 'a',
      time: 2,
      type: 'vector/insert',
      payload: 'b',
    })
    a.syncronize({
      id: 'c',
      insertBefore: 'a',
      time: 3,
      type: 'vector/insert',
      payload: 'c',
    })

    a.syncronize({
      id: 'c',
      type: 'logux/processed',
    })
    b.syncronize({
      id: 'b',
      type: 'logux/processed',
    })

    b.syncronize({
      id: 'c',
      insertBefore: 'a',
      time: 3,
      type: 'vector/inserted',
      payload: 'c',
    })
    a.syncronize({
      id: 'b',
      insertBefore: 'a',
      time: 2,
      type: 'vector/inserted',
      payload: 'b',
    })

    expect(a.getValue()).toEqual(['b', 'c', 'a'])
    expect(b.getValue()).toEqual(['b', 'c', 'a'])
  })
})
