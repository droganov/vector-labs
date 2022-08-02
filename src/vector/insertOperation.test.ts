import { insertOperation } from './insertOperation.js'
import {
  LoguxProcessedOperation,
  VectorDeletedOperation,
  VectorDeleteOperation,
  VectorInsertedOperation,
  VectorInsertOperation,
} from './createVector.js'

it('takes vector/insert operation', () => {
  let operation: VectorInsertOperation<string> = {
    id: '1',
    time: 1,
    type: 'vector/insert',
    payload: '1',
    insertBefore: null,
  }
  let result = insertOperation(
    { operationsInOrder: [], operationsInTime: [] },
    {
      operation,
      timeIndex: 0,
      orderIndex: 0,
    },
  )
  expect(result).toEqual({
    operationsInOrder: [operation],
    operationsInTime: [operation],
  })
})
it('takes vector/inserted operation', () => {
  let operation: VectorInsertedOperation<string> = {
    id: '1',
    time: 1,
    type: 'vector/inserted',
    payload: '1',
    insertBefore: null,
  }
  let result = insertOperation(
    { operationsInOrder: [], operationsInTime: [] },
    {
      operation,
      timeIndex: 0,
      orderIndex: 0,
    },
  )
  expect(result).toEqual({
    operationsInOrder: [operation],
    operationsInTime: [operation],
  })
})
it('skips vector/delete operation', () => {
  let operation: VectorDeleteOperation = {
    id: '2',
    operationId: '1',
    time: 2,
    type: 'vector/delete',
  }
  let result = insertOperation(
    { operationsInOrder: [], operationsInTime: [] },
    {
      operation,
      timeIndex: 0,
      orderIndex: 0,
    },
  )
  expect(result).toEqual({
    operationsInOrder: [],
    operationsInTime: [],
  })
})
it('skips vector/deleted operation', () => {
  let operation: VectorDeletedOperation = {
    id: '2',
    operationId: '1',
    time: 2,
    type: 'vector/deleted',
  }
  let result = insertOperation(
    { operationsInOrder: [], operationsInTime: [] },
    {
      operation,
      timeIndex: 0,
      orderIndex: 0,
    },
  )
  expect(result).toEqual({
    operationsInOrder: [],
    operationsInTime: [],
  })
})
it('skips logux/processed event', () => {
  let operation: LoguxProcessedOperation = {
    id: '2',
    type: 'logux/processed',
  }
  let result = insertOperation(
    { operationsInOrder: [], operationsInTime: [] },
    {
      operation,
      timeIndex: 0,
      orderIndex: 0,
    },
  )
  expect(result).toEqual({
    operationsInOrder: [],
    operationsInTime: [],
  })
})
