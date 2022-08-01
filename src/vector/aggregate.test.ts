import { aggregate } from './aggregate.js'
import { VectorInsertOperations } from './createVector.js'

describe('vector/insert', () => {
  it('takes vector/insert', () => {
    let visibleOperations: VectorInsertOperations<string>[] = [
      {
        id: 'a',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
    ]
    let result = aggregate(visibleOperations, {
      a: { order: 0, undoCount: 0, confirmCount: 0 },
    })
    expect(result).toEqual({
      visibleOperations,
      result: ['a'],
    })
  })
  it('ignores deleted vector/insert', () => {
    let visibleOperations: VectorInsertOperations<string>[] = [
      {
        id: 'a',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
    ]
    let result = aggregate(visibleOperations, {
      a: { order: 0, undoCount: 1, confirmCount: 0 },
    })
    expect(result).toEqual({
      visibleOperations: [],
      result: [],
    })
  })
})
describe('vector/inserted', () => {
  it('takes vector/inserted', () => {
    let visibleOperations: VectorInsertOperations<string>[] = [
      {
        id: 'a',
        time: 1,
        type: 'vector/inserted',
        insertBefore: null,
        payload: 'a',
      },
    ]
    let result = aggregate(visibleOperations, {
      a: { order: 0, undoCount: 0, confirmCount: 0 },
    })
    expect(result).toEqual({
      visibleOperations,
      result: ['a'],
    })
  })
  it('ignores deleted vector/inserted', () => {
    let visibleOperations: VectorInsertOperations<string>[] = [
      {
        id: 'a',
        time: 1,
        type: 'vector/inserted',
        insertBefore: null,
        payload: 'a',
      },
    ]
    let result = aggregate(visibleOperations, {
      a: { order: 0, undoCount: 1, confirmCount: 0 },
    })
    expect(result).toEqual({
      visibleOperations: [],
      result: [],
    })
  })
})
describe('logux/processed', () => {
  it('ignores logux/processed', () => {
    let visibleOperations = [
      {
        id: 'a',
        time: 1,
        type: 'logux/processed',
      },
    ] as unknown as VectorInsertOperations<string>[]
    let result = aggregate(visibleOperations, {
      a: { order: 0, undoCount: 0, confirmCount: 0 },
    })
    expect(result).toEqual({
      visibleOperations: [],
      result: [],
    })
  })
})
