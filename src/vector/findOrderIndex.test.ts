import { findOrderIndex } from './findOrderIndex.js'
import { VectorOperation, VectorState } from './vector.js'

it('returns 0 when has empty logs', () => {
  let state: VectorState<string> = {
    operationsInTime: [],
    operationsTable: {},
    operationsInOrder: [],
    visibleOperations: [],
    result: [],
  }

  let operation: VectorOperation<string> = {
    id: 'a',
    time: 1,
    type: 'vector/insert',
    insertBefore: null,
    payload: 'a',
  }

  let index = findOrderIndex(state, operation)

  expect(index).toBe(0)
})

it('returns operationsInOrder length when has no pointer operationsTable', () => {
  let state: VectorState<string> = {
    operationsInTime: [],
    operationsTable: {},
    operationsInOrder: [
      {
        id: 'b',
        time: 2,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'b',
      },
    ],
    visibleOperations: [],
    result: [],
  }

  let operation: VectorOperation<string> = {
    id: 'a',
    time: 1,
    type: 'vector/insert',
    insertBefore: null,
    payload: 'a',
  }

  let index = findOrderIndex(state, operation)

  expect(index).toBe(1)
})

it('takes index from operationsTable', () => {
  let state: VectorState<string> = {
    operationsInTime: [],
    operationsTable: {
      b: { order: 3, undoCount: 0 },
    },
    operationsInOrder: [],
    visibleOperations: [],
    result: [],
  }

  let operation: VectorOperation<string> = {
    id: 'a',
    time: 1,
    type: 'vector/insert',
    insertBefore: 'b',
    payload: 'a',
  }

  let index = findOrderIndex(state, operation)

  expect(index).toBe(3)
})
