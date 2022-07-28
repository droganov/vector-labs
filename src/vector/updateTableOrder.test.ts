import { updateTableOrder } from './updateTableOrder.js'
import { VectorState } from './vector.js'

it('returns empty hash when state is empty', () => {
  let state: VectorState<string> = {
    operationsInTime: [],
    operationsTable: {},
    operationsInOrder: [],
    visibleOperations: [],
    result: [],
  }

  let result = updateTableOrder(state, [], 0)

  expect(result).toEqual({})
})

it('adds operation hash', () => {
  let state: VectorState<string> = {
    operationsInTime: [],
    operationsTable: {},
    operationsInOrder: [],
    visibleOperations: [],
    result: [],
  }

  let result = updateTableOrder(
    state,
    [
      {
        id: 'a',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
    ],
    0,
  )

  expect(result).toEqual({ a: { order: 0, undoCount: 0 } })
})

it('updates operation hash', () => {
  let state: VectorState<string> = {
    operationsInTime: [],
    operationsTable: { a: { order: 0, undoCount: 0 } },
    operationsInOrder: [],
    visibleOperations: [],
    result: [],
  }

  let result = updateTableOrder(
    state,
    [
      {
        id: 'b',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
      {
        id: 'a',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
    ],
    0,
  )

  expect(result).toEqual({
    b: { order: 0, undoCount: 0 },
    a: { order: 1, undoCount: 0 },
  })
})

it('is immutable', () => {
  let state: VectorState<string> = {
    operationsInTime: [],
    operationsTable: { a: { order: 0, undoCount: 0 } },
    operationsInOrder: [],
    visibleOperations: [],
    result: [],
  }

  let result = updateTableOrder(
    state,
    [
      {
        id: 'a',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
    ],
    0,
  )

  expect(result).not.toBe(state.operationsTable)
  expect(result.a).not.toBe(state.operationsTable.a)
})
