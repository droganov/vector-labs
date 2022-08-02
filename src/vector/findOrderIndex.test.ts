import { findOrderIndex } from './findOrderIndex.js'
import {
  VectorClientOperation,
  VectorInsertOperations,
} from './createVector.js'

it('appends first', () => {
  let operation: VectorClientOperation<string> = {
    id: 'a',
    time: 1,
    type: 'vector/insert',
    insertBefore: null,
    payload: 'a',
  }

  let index = findOrderIndex([], operation)

  expect(index).toBe(0)
})

it('appends n-th', () => {
  let operationsInOrder: VectorInsertOperations<any>[] = [
    {
      id: 'a',
      time: 1,
      type: 'vector/insert',
      insertBefore: null,
      payload: 'a',
    },
  ]
  let operation: VectorInsertOperations<string> = {
    id: 'b',
    time: 2,
    type: 'vector/insert',
    insertBefore: null,
    payload: 'b',
  }

  let index = findOrderIndex(operationsInOrder, operation)

  expect(index).toBe(1)
})
it('appends reversed', () => {
  let operationsInOrder: VectorInsertOperations<any>[] = [
    {
      id: 'b',
      time: 2,
      type: 'vector/insert',
      insertBefore: null,
      payload: 'b',
    },
  ]

  let operation: VectorInsertOperations<string> = {
    id: 'a',
    time: 1,
    type: 'vector/inserted',
    insertBefore: null,
    payload: 'a',
  }

  let index = findOrderIndex(operationsInOrder, operation)

  expect(index).toBe(0)
})

it('prepends one', () => {
  let operationsInOrder: VectorInsertOperations<any>[] = [
    {
      id: 'a',
      time: 1,
      type: 'vector/insert',
      insertBefore: null,
      payload: 'a',
    },
  ]

  let operation: VectorClientOperation<string> = {
    id: 'b',
    time: 2,
    type: 'vector/insert',
    insertBefore: 'a',
    payload: 'b',
  }

  let index = findOrderIndex(operationsInOrder, operation)

  expect(index).toBe(0)
})

it('prepends another', () => {
  let operationsInOrder: VectorInsertOperations<any>[] = [
    {
      id: 'b',
      time: 2,
      type: 'vector/insert',
      insertBefore: 'a',
      payload: 'b',
    },
    {
      id: 'a',
      time: 1,
      type: 'vector/insert',
      insertBefore: null,
      payload: 'a',
    },
  ]

  let operation: VectorClientOperation<string> = {
    id: 'c',
    time: 3,
    type: 'vector/insert',
    insertBefore: 'a',
    payload: 'c',
  }

  let index = findOrderIndex(operationsInOrder, operation)

  expect(index).toBe(1)
})

it('prepends reversed', () => {
  let operationsInOrder: VectorInsertOperations<any>[] = [
    {
      id: 'b',
      time: 3,
      type: 'vector/insert',
      insertBefore: 'a',
      payload: 'b',
    },
    {
      id: 'a',
      time: 1,
      type: 'vector/insert',
      insertBefore: null,
      payload: 'a',
    },
  ]

  let operation: VectorInsertOperations<string> = {
    id: 'c',
    time: 2,
    type: 'vector/inserted',
    insertBefore: 'a',
    payload: 'c',
  }

  let index = findOrderIndex(operationsInOrder, operation)

  expect(index).toBe(0)
})
