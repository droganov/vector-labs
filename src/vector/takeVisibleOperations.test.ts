import { takeVisibleOperations } from './takeVisibleOperations.js'
import { VectorClientOperation } from './vector.js'

it('ignores invisible operations', () => {
  let result = takeVisibleOperations(
    [
      {
        id: 'a',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
    ],
    { a: { order: 0, undoCount: 1 } },
  )

  expect(result).toEqual([])
})

it('takes visible operations', () => {
  let operation: VectorClientOperation<string> = {
    id: 'a',
    time: 1,
    type: 'vector/insert',
    insertBefore: null,
    payload: 'a',
  }
  let result = takeVisibleOperations([operation], {
    a: { order: 0, undoCount: 0 },
  })

  expect(result).toEqual([operation])
})

it('is immutable', () => {
  let operations: VectorClientOperation<string>[] = [
    {
      id: 'a',
      time: 1,
      type: 'vector/insert',
      insertBefore: null,
      payload: 'a',
    },
  ]
  let result = takeVisibleOperations(operations, {
    a: { order: 0, undoCount: 0 },
  })

  expect(result).not.toBe(operations)
})

it('throws when the state is not consistent', () => {
  expect(() => {
    takeVisibleOperations(
      [
        {
          id: 'b',
          time: 1,
          type: 'vector/insert',
          insertBefore: null,
          payload: 'b',
        },
      ],
      {
        a: { order: 0, undoCount: 0 },
      },
    )
  }).toThrow("Cannot read property 'undoCount' of undefined")
})
