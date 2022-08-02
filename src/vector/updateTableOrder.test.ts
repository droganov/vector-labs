import { updateTableOrder } from './updateTableOrder.js'

it('returns empty hash when state is empty', () => {
  let result = updateTableOrder({
    operationsInOrder: [],
    operationsTable: {},
    reorderFrom: 0,
  })

  expect(result).toEqual({})
})

it('throws when the state is not consistent', () => {
  expect(() => {
    updateTableOrder({
      operationsInOrder: [
        {
          id: 'a',
          time: 1,
          type: 'vector/insert',
          insertBefore: null,
          payload: 'a',
        },
      ],
      operationsTable: {},
      reorderFrom: 0,
    })
  }).toThrow('Key "a" is not in operations table')
})

it('updates pointers', () => {
  let result = updateTableOrder({
    operationsInOrder: [
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
    operationsTable: {
      a: { order: 0, undoCount: 0, confirmCount: 0 },
      b: { order: 1, undoCount: 0, confirmCount: 0 },
    },
    reorderFrom: 0,
  })

  expect(result).toEqual({
    b: { order: 0, undoCount: 0, confirmCount: 0 },
    a: { order: 1, undoCount: 0, confirmCount: 0 },
  })
})

it('is immutable', () => {
  let operationsTable = { a: { order: 0, undoCount: 0, confirmCount: 0 } }

  let result = updateTableOrder({
    operationsTable,
    reorderFrom: 0,
    operationsInOrder: [
      {
        id: 'a',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
    ],
  })

  expect(result).not.toBe(operationsTable)
  expect(result.a).not.toBe(operationsTable.a)
})
