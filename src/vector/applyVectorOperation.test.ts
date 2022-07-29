import { applyVectorOperation } from './applyVectorOperation.js'
import { VectorOperation } from './vector.js'

it('throws when operation type is not supported', () => {
  expect(() => {
    applyVectorOperation(
      {},
      { id: '', type: 'unknown' } as unknown as VectorOperation<unknown>,
      0,
    )
  }).toThrow('Unknown vector operation type')
})

it('inserts first', () => {
  let result = applyVectorOperation(
    {},
    {
      id: 'a',
      time: 1,
      type: 'vector/insert',
      insertBefore: null,
      payload: 'a',
    },
    0,
  )
  expect(result).toEqual({
    operationsTable: {
      a: {
        order: 0,
        undoCount: 0,
      },
    },
    reOrderFrom: 0,
  })
})

it('inserts second', () => {
  let result = applyVectorOperation(
    {
      a: {
        order: 0,
        undoCount: 0,
      },
    },
    {
      id: 'b',
      time: 1,
      type: 'vector/insert',
      insertBefore: 'a',
      payload: 'b',
    },
    1,
  )
  expect(result).toEqual({
    operationsTable: {
      a: {
        order: 0,
        undoCount: 0,
      },
      b: {
        order: 1,
        undoCount: 0,
      },
    },
    reOrderFrom: 1,
  })
})
