import { next } from './next.js'
import { VectorClientOperation, VectorState } from './createVector.js'

it('returns same state when operation exists in hashtable', () => {
  let operation: VectorClientOperation<string> = {
    insertBefore: null,
    id: 'a',
    time: 1,
    type: 'vector/insert',
    payload: 'item',
  }
  let state: VectorState<string> = {
    operationsInTime: [],
    operationsInOrder: [],
    operationsTable: {
      a: { order: 0, undoCount: 0, confirmCount: 0 },
    },
    visibleOperations: [],
    result: [],
  }
  let result = next(state, operation)

  expect(result).toBe(state)
})

describe('insertions', () => {
  it('appends first operation', () => {
    let operation: VectorClientOperation<string> = {
      insertBefore: null,
      id: 'a',
      time: 1,
      type: 'vector/insert',
      payload: 'item',
    }
    let state: VectorState<string> = {
      operationsInTime: [],
      operationsInOrder: [],
      operationsTable: {},
      visibleOperations: [],
      result: [],
    }
    let result = next(state, operation)

    expect(result).toEqual({
      operationsInTime: [operation],
      operationsInOrder: [operation],
      operationsTable: { a: { order: 0, undoCount: 0, confirmCount: 0 } },
      visibleOperations: [operation],
      result: ['item'],
    })
  })
  it('appends second operation', () => {
    let firstOperation: VectorClientOperation<string> = {
      insertBefore: null,
      id: 'a',
      time: 1,
      type: 'vector/insert',
      payload: 'item 1',
    }
    let secondOperation: VectorClientOperation<string> = {
      insertBefore: null,
      id: 'b',
      time: 2,
      type: 'vector/insert',
      payload: 'item 2',
    }
    let state: VectorState<string> = {
      operationsInTime: [firstOperation],
      operationsInOrder: [firstOperation],
      operationsTable: { a: { order: 0, undoCount: 0, confirmCount: 0 } },
      visibleOperations: [firstOperation],
      result: ['item'],
    }
    let result = next(state, secondOperation)

    expect(result).toEqual({
      operationsInTime: [firstOperation, secondOperation],
      operationsInOrder: [firstOperation, secondOperation],
      operationsTable: {
        a: { order: 0, undoCount: 0, confirmCount: 0 },
        b: { order: 1, undoCount: 0, confirmCount: 0 },
      },
      visibleOperations: [firstOperation, secondOperation],
      result: ['item 1', 'item 2'],
    })
  })
  it('inserts second operation before first', () => {
    let firstOperation: VectorClientOperation<string> = {
      insertBefore: null,
      id: 'a',
      time: 1,
      type: 'vector/insert',
      payload: 'item 1',
    }
    let secondOperation: VectorClientOperation<string> = {
      insertBefore: 'a',
      id: 'b',
      time: 2,
      type: 'vector/insert',
      payload: 'item 2',
    }
    let state: VectorState<string> = {
      operationsInTime: [firstOperation],
      operationsInOrder: [firstOperation],
      operationsTable: { a: { order: 0, undoCount: 0, confirmCount: 0 } },
      visibleOperations: [firstOperation],
      result: ['item'],
    }
    let result = next(state, secondOperation)

    expect(result).toEqual({
      operationsInTime: [firstOperation, secondOperation],
      operationsInOrder: [secondOperation, firstOperation],
      operationsTable: {
        a: { order: 1, undoCount: 0, confirmCount: 0 },
        b: { order: 0, undoCount: 0, confirmCount: 0 },
      },
      visibleOperations: [secondOperation, firstOperation],
      result: ['item 2', 'item 1'],
    })
  })
  it('resolves race condition', () => {
    let firstOperation: VectorClientOperation<string> = {
      insertBefore: null,
      id: 'a',
      time: 2,
      type: 'vector/insert',
      payload: 'item 1',
    }
    let secondOperation: VectorClientOperation<string> = {
      insertBefore: 'a',
      id: 'b',
      time: 1,
      type: 'vector/insert',
      payload: 'item 2',
    }
    let state: VectorState<string> = {
      operationsInTime: [firstOperation],
      operationsInOrder: [firstOperation],
      operationsTable: { a: { order: 0, undoCount: 0, confirmCount: 0 } },
      visibleOperations: [firstOperation],
      result: ['item'],
    }
    let result = next(state, secondOperation)

    expect(result).toEqual({
      operationsInTime: [secondOperation, firstOperation],
      operationsInOrder: [secondOperation, firstOperation],
      operationsTable: {
        a: { order: 1, undoCount: 0, confirmCount: 0 },
        b: { order: 0, undoCount: 0, confirmCount: 0 },
      },
      visibleOperations: [secondOperation, firstOperation],
      result: ['item 2', 'item 1'],
    })
  })
})
