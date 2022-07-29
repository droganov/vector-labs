import { updateTableOrder } from './updateTableOrder.js'

it('returns empty hash when state is empty', () => {
  let result = updateTableOrder({}, [], 0)

  expect(result).toEqual({})
})

it('throws when the state is not consistent', () => {
  expect(() => {
    updateTableOrder(
      {},
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
  }).toThrow('Key "a" is not in operations table')
})

it('updates pointers', () => {
  let result = updateTableOrder(
    { a: { order: 0, undoCount: 0 }, b: { order: 1, undoCount: 0 } },
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
  let operationsTable = { a: { order: 0, undoCount: 0 } }

  let result = updateTableOrder(
    operationsTable,
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

  expect(result).not.toBe(operationsTable)
  expect(result.a).not.toBe(operationsTable.a)
})
