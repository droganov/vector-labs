import { aggregate } from './aggregate.js'
import { VectorOperation } from './createVector.js'

describe('vector/insert', () => {
  it('takes vector/insert', () => {
    let visibleOperations: VectorOperation<string>[] = [
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
    let visibleOperations: VectorOperation<string>[] = [
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
    let visibleOperations: VectorOperation<string>[] = [
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
    let visibleOperations: VectorOperation<string>[] = [
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
    let visibleOperations: VectorOperation<string>[] = [
      {
        id: 'a',
        time: 1,
        type: 'logux/processed',
      },
    ]
    let result = aggregate(visibleOperations, {
      a: { order: 0, undoCount: 0, confirmCount: 0 },
    })
    expect(result).toEqual({
      visibleOperations: [],
      result: [],
    })
  })
})
