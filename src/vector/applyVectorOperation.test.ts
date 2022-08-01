import { applyVectorOperation } from './applyVectorOperation.js'
import { VectorClientOperation } from './createVector.js'

it('throws when operation type is not supported', () => {
  expect(() => {
    applyVectorOperation(
      {},
      { id: '', type: 'unknown' } as unknown as VectorClientOperation<unknown>,
      0,
    )
  }).toThrow('Unknown vector operation type')
})

describe('vector/insert', () => {
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
          confirmCount: 0,
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
          confirmCount: 0,
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
          confirmCount: 0,
        },
        b: {
          order: 1,
          undoCount: 0,
          confirmCount: 0,
        },
      },
      reOrderFrom: 1,
    })
  })
})

describe('vector/delete', () => {
  it('bumps undoCount', () => {
    let result = applyVectorOperation(
      {
        a: {
          order: 0,
          undoCount: 0,
          confirmCount: 0,
        },
      },
      {
        id: 'b',
        operationId: 'a',
        time: 1,
        type: 'vector/delete',
      },
      1,
    )
    expect(result.operationsTable.a.undoCount).toBe(1)
  })
  it('retun smallest reOrderFrom', () => {
    let result = applyVectorOperation(
      {
        a: {
          order: 0,
          undoCount: 0,
          confirmCount: 0,
        },
      },
      {
        id: 'b',
        operationId: 'a',
        time: 1,
        type: 'vector/delete',
      },
      1,
    )
    expect(result.reOrderFrom).toBe(0)
  })
  it('adds operation hash to table', () => {
    let result = applyVectorOperation(
      {
        a: {
          order: 0,
          undoCount: 0,
          confirmCount: 0,
        },
      },
      {
        id: 'b',
        operationId: 'a',
        time: 1,
        type: 'vector/delete',
      },
      1,
    )
    expect(result.operationsTable.b).toEqual({
      order: -1,
      undoCount: 0,
      confirmCount: 0,
    })
  })
  it('throws when deleting unexisting operations', () => {
    let getResult = (): void => {
      applyVectorOperation(
        {},
        {
          id: 'b',
          operationId: 'a',
          time: 1,
          type: 'vector/delete',
        },
        1,
      )
    }
    expect(getResult).toThrow('Vector: operation "a" not found')
  })
})
