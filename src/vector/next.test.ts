import { next } from './next.js'
import {
  VectorClientOperation,
  VectorDeleteOperation,
  VectorInsertOperation,
  VectorOperation,
  VectorState,
} from './createVector.js'

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
  it('sorts inserts', () => {
    let firstOperation: VectorOperation<string> = {
      insertBefore: null,
      id: 'a',
      time: 1,
      type: 'vector/insert',
      payload: 'item a',
    }
    let secondOperation: VectorOperation<string> = {
      insertBefore: 'a',
      id: 'b',
      time: 2,
      type: 'vector/insert',
      payload: 'item b',
    }
    let thirdOperation: VectorOperation<string> = {
      id: 'c',
      insertBefore: 'a',
      time: 3,
      type: 'vector/insert',
      payload: 'item c',
    }
    let fourthOperation: VectorOperation<string> = {
      id: 'd',
      insertBefore: 'a',
      time: 1.5,
      type: 'vector/inserted',
      payload: 'item d',
    }
    let state: VectorState<string> = {
      operationsInTime: [],
      operationsInOrder: [],
      operationsTable: {},
      visibleOperations: [],
      result: [],
    }

    let state1 = next(state, firstOperation)
    let state2 = next(state1, secondOperation)
    let state3 = next(state2, {
      id: 'a',
      type: 'logux/undo',
    })
    let state4 = next(state3, {
      id: 'b',
      type: 'logux/processed',
    })
    let state5 = next(state4, thirdOperation)
    let state6 = next(state5, fourthOperation)

    expect(state6.operationsInTime).toEqual([
      firstOperation,
      fourthOperation,
      secondOperation,
      thirdOperation,
    ])
    expect(state6.operationsInOrder).toEqual([
      fourthOperation,
      secondOperation,
      thirdOperation,
      firstOperation,
    ])
    expect(state6.operationsTable).toEqual({
      a: { order: 3, undoCount: 1, confirmCount: 1 }, // 1
      d: { order: 0, undoCount: 0, confirmCount: 1 }, // 1.5
      c: { order: 2, undoCount: 0, confirmCount: 0 }, // 3
      b: { order: 1, undoCount: 0, confirmCount: 1 }, // 2
    })
    expect(state6.visibleOperations).toEqual([
      fourthOperation,
      secondOperation,
      thirdOperation,
    ])
    expect(state6.result).toEqual(['item d', 'item b', 'item c'])
  })
})

describe('deletions', () => {
  it('deletes', () => {
    let insertOperation: VectorInsertOperation<string> = {
      insertBefore: null,
      id: 'a',
      time: 1,
      type: 'vector/insert',
      payload: 'item',
    }
    let deleteOperation: VectorDeleteOperation = {
      id: 'b',
      operationId: 'a',
      time: 2,
      type: 'vector/delete',
    }
    let state: VectorState<string> = {
      operationsInTime: [insertOperation],
      operationsInOrder: [insertOperation],
      operationsTable: { a: { order: 0, undoCount: 0, confirmCount: 0 } },
      visibleOperations: [insertOperation],
      result: ['a'],
    }
    let result = next(state, deleteOperation)

    expect(result).toEqual({
      operationsInTime: [insertOperation],
      operationsInOrder: [insertOperation],
      operationsTable: {
        a: { order: 0, undoCount: 1, confirmCount: 0 },
        b: { order: -1, undoCount: 0, confirmCount: 0 },
      },
      visibleOperations: [],
      result: [],
    })
  })
  it('supports adding before deleted operations', () => {
    let insertOperation1: VectorInsertOperation<string> = {
      insertBefore: null,
      id: 'a',
      time: 1,
      type: 'vector/insert',
      payload: 'item',
    }
    let insertOperation2: VectorInsertOperation<string> = {
      insertBefore: 'a',
      id: 'c',
      time: 3,
      type: 'vector/insert',
      payload: 'item c',
    }
    let deleteOperation: VectorDeleteOperation = {
      id: 'b',
      operationId: 'a',
      time: 2,
      type: 'vector/delete',
    }
    let state: VectorState<string> = {
      operationsInTime: [insertOperation1],
      operationsInOrder: [insertOperation1],
      operationsTable: { a: { order: 0, undoCount: 0, confirmCount: 0 } },
      visibleOperations: [insertOperation1],
      result: ['a'],
    }
    let deletedState = next(state, deleteOperation)
    let insertedState = next(deletedState, insertOperation2)

    expect(insertedState).toEqual({
      operationsInTime: [insertOperation1, insertOperation2],
      operationsInOrder: [insertOperation2, insertOperation1],
      operationsTable: {
        a: { order: 1, undoCount: 1, confirmCount: 0 },
        b: { order: -1, undoCount: 0, confirmCount: 0 },
        c: { order: 0, undoCount: 0, confirmCount: 0 },
      },
      visibleOperations: [insertOperation2],
      result: [insertOperation2.payload],
    })
  })
})
