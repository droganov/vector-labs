import { addOperationToHashTable } from './addOperationToHashTable.js'
import { VectorClientOperation } from './createVector.js'

it('throws when operation type is not supported', () => {
  expect(() => {
    addOperationToHashTable({
      operationsTable: {},
      operation: {
        id: '',
        type: 'unknown',
      } as unknown as VectorClientOperation<unknown>,
      operationsInOrder: [],
      order: 0,
    })
  }).toThrow('Unknown vector operation type')
})

describe('vector/insert', () => {
  it('inserts first', () => {
    let result = addOperationToHashTable({
      operationsTable: {},
      operation: {
        id: 'a',
        time: 1,
        type: 'vector/insert',
        insertBefore: null,
        payload: 'a',
      },
      operationsInOrder: [],
      order: 0,
    })
    expect(result).toEqual({
      a: {
        order: 0,
        undoCount: 0,
        confirmCount: 0,
      },
    })
  })

  it('inserts second', () => {
    let result = addOperationToHashTable({
      operationsTable: {
        a: {
          order: 0,
          undoCount: 0,
          confirmCount: 0,
        },
      },
      operation: {
        id: 'b',
        time: 1,
        type: 'vector/insert',
        insertBefore: 'a',
        payload: 'b',
      },
      operationsInOrder: [],
      order: 1,
    })
    expect(result).toEqual({
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
    })
  })
})
describe('vector/inserted', () => {
  it('inserts first', () => {
    let result = addOperationToHashTable({
      operationsTable: {},
      operation: {
        id: 'a',
        time: 1,
        type: 'vector/inserted',
        insertBefore: null,
        payload: 'a',
      },
      operationsInOrder: [],
      order: 0,
    })
    expect(result).toEqual({
      a: {
        order: 0,
        undoCount: 0,
        confirmCount: 1,
      },
    })
  })

  it('inserts second', () => {
    let result = addOperationToHashTable({
      operationsTable: {
        a: {
          order: 0,
          undoCount: 0,
          confirmCount: 0,
        },
      },
      operation: {
        id: 'b',
        time: 1,
        type: 'vector/inserted',
        insertBefore: 'a',
        payload: 'b',
      },
      operationsInOrder: [],
      order: 1,
    })
    expect(result).toEqual({
      a: {
        order: 0,
        undoCount: 0,
        confirmCount: 0,
      },
      b: {
        order: 1,
        undoCount: 0,
        confirmCount: 1,
      },
    })
  })
})

describe('vector/delete', () => {
  it('bumps undoCount', () => {
    let result = addOperationToHashTable({
      operationsTable: {
        a: {
          order: 0,
          undoCount: 0,
          confirmCount: 1,
        },
      },
      operation: {
        id: 'b',
        operationId: 'a',
        time: 1,
        type: 'vector/delete',
      },
      operationsInOrder: [],
      order: 0,
    })
    expect(result.a.undoCount).toBe(1)
  })
  it('reorders', () => {
    let result = addOperationToHashTable({
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
      operation: {
        id: 'c',
        operationId: 'a',
        time: 1,
        type: 'vector/delete',
      },
      operationsInOrder: [
        {
          id: 'b',
          time: 2,
          type: 'vector/inserted',
          insertBefore: 'a',
          payload: 'b',
        },
        {
          id: 'a',
          time: 1,
          type: 'vector/inserted',
          insertBefore: null,
          payload: 'a',
        },
      ],
      order: 1,
    })
    expect(result.c.order).toBe(-1)
    expect(result.b.order).toBe(0)
    expect(result.a.order).toBe(1)
  })
  it('adds operation hash to table', () => {
    let result = addOperationToHashTable({
      operationsTable: {
        a: {
          order: 0,
          undoCount: 0,
          confirmCount: 0,
        },
      },
      operation: {
        id: 'b',
        operationId: 'a',
        time: 1,
        type: 'vector/delete',
      },
      operationsInOrder: [
        {
          id: 'a',
          time: 1,
          type: 'vector/inserted',
          insertBefore: null,
          payload: 'a',
        },
      ],
      order: 1,
    })
    expect(result.b).toEqual({
      order: -1,
      undoCount: 0,
      confirmCount: 0,
    })
  })
  it('throws when deleting unexisting operations', () => {
    let getResult = (): void => {
      addOperationToHashTable({
        operationsTable: {},
        operation: {
          id: 'b',
          operationId: 'a',
          time: 1,
          type: 'vector/delete',
        },
        operationsInOrder: [],
        order: 0,
      })
    }
    expect(getResult).toThrow('Vector: operation "a" not found')
  })
})
