import { next } from './next.js'
import { OutOfRangeError } from './OutOfRangeError.js'
import {
  LOGUX_PROCESSED,
  VECTOR_DELETE,
  VECTOR_DELETED,
  VECTOR_INSERT,
  VECTOR_INSERTED,
} from './constants.js'

// #region Types
export type AnyOperation = { id: string; time: number; type: string }

export type OperationId = AnyOperation['id']

export type VectorInsertOperation<Item> = AnyOperation & {
  insertBefore: OperationId | null
  payload: Item
  type: typeof VECTOR_INSERT
}
export type VectorInsertedOperation<Item> = AnyOperation & {
  insertBefore: OperationId | null
  payload: Item
  type: typeof VECTOR_INSERTED
}

export type VectorDeleteOperation = AnyOperation & {
  operationId: OperationId
  type: typeof VECTOR_DELETE
}
export type VectorDeletedOperation = AnyOperation & {
  operationId: OperationId
  type: typeof VECTOR_DELETED
}

export type LoguxProcessedOperation = AnyOperation & {
  type: typeof LOGUX_PROCESSED
}

export type VectorInsertOperations<Item> =
  | VectorInsertOperation<Item>
  | VectorInsertedOperation<Item>

export type VectorClientOperation<Item> =
  | VectorInsertOperation<Item>
  | VectorDeleteOperation

export type VectorRemoteOperation<Item> =
  | VectorInsertedOperation<Item>
  | VectorDeletedOperation
  | LoguxProcessedOperation

export type VectorOperation<Item> =
  | VectorClientOperation<Item>
  | VectorRemoteOperation<Item>

export type VectorState<Item> = {
  operationsInTime: VectorInsertOperations<Item>[] // sorted by time
  operationsInOrder: VectorInsertOperations<Item>[] // sorted by id-relation
  operationsTable: Record<
    OperationId,
    { order: number; undoCount: number; confirmCount: number }
  >
  visibleOperations: VectorInsertOperations<Item>[] // operationsInOrder filtered by undoCount === 0
  result: Item[] // mapped values of visibleOperations
}

export type VectorRecord<Item> = VectorState<Item>['operationsTable']

interface VectorFactory {
  <Item>(): {
    getValue(): Item[]
    insert(item: Item, index?: number): void
    delete(index: number): void
    syncronize(operation: VectorRemoteOperation<Item>): void
  }
}
// #endregion

export const createVector: VectorFactory = <Item>() => {
  let state: VectorState<Item> = {
    operationsInTime: [],
    operationsInOrder: [],
    operationsTable: {},
    visibleOperations: [],
    result: [],
  }

  return {
    getValue: () => state.result,
    insert(item: Item, index = NaN) {
      if (!isNaN(index) && !(index in state.visibleOperations)) {
        throw new OutOfRangeError()
      }
      let insertBefore = state.visibleOperations[index]?.id || null
      let operation: VectorInsertOperation<Item> = {
        insertBefore,
        id: Math.random().toString(),
        time: Date.now(),
        type: VECTOR_INSERT,
        payload: item,
      }
      state = next(state, operation)
    },
    delete(index: number) {
      if (!(index in state.visibleOperations)) {
        throw new OutOfRangeError()
      }
      let operation: VectorDeleteOperation = {
        id: Math.random().toString(),
        operationId: state.visibleOperations[index].id,
        time: Date.now(),
        type: VECTOR_DELETE,
      }
      state = next(state, operation)
    },
    syncronize() {},
  }
}
