import { next } from './next.js'
import { OutOfRangeError } from './OutOfRangeError.js'
import {
  LOGUX_PROCESSED,
  LOGUX_UNDO,
  VECTOR_DELETE,
  VECTOR_DELETED,
  VECTOR_INSERT,
  VECTOR_INSERTED,
} from './constants.js'

// #region Types
export type AnyOperation = { id: string; type: string }

export type OperationId = AnyOperation['id']

export type VectorInsertOperation<Item> = {
  id: string
  insertBefore: OperationId | null
  payload: Item
  time: number
  type: typeof VECTOR_INSERT
}
export type VectorInsertedOperation<Item> = {
  id: string
  insertBefore: OperationId | null
  payload: Item
  time: number
  type: typeof VECTOR_INSERTED
}

export type VectorDeleteOperation = {
  id: string
  operationId: OperationId
  time: number
  type: typeof VECTOR_DELETE
}
export type VectorDeletedOperation = {
  id: string
  operationId: OperationId
  time: number
  type: typeof VECTOR_DELETED
}

export type LoguxProcessedOperation = {
  id: string
  type: typeof LOGUX_PROCESSED
}
export type LoguxUndoOperation = {
  id: string
  type: typeof LOGUX_UNDO
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
  | LoguxUndoOperation

export type VectorOperation<Item> =
  | VectorClientOperation<Item>
  | VectorRemoteOperation<Item>

export type VectorInsertsOperationState = {
  operation?: undefined
  order: number
  undoCount: number
  confirmCount: number
}

export type VectorDeleteOperationState = {
  confirmCount: number
  operation: VectorDeleteOperation | VectorDeletedOperation
  order?: undefined
  undoCount: number
}

export type VectorAnyOperationState =
  | VectorInsertsOperationState
  | VectorDeleteOperationState

export type VectorState<Item> = {
  operationsInTime: VectorInsertOperations<Item>[] // sorted by time
  operationsInOrder: VectorInsertOperations<Item>[] // sorted by id-relation
  operationsTable: Record<OperationId, VectorAnyOperationState>
  visibleOperations: VectorInsertOperations<Item>[] // operationsInOrder filtered by undoCount === 0
  result: Item[] // mapped values of visibleOperations
}

export type VectorRecord<Item> = VectorState<Item>['operationsTable']

interface VectorFactory {
  <Item>(): {
    getValue(): Item[]
    insert(item: Item, index?: number): void
    delete(index: number): void
    syncronize(operation: VectorOperation<Item>): void
  }
}
// #endregion

export const createVector: VectorFactory = () => {
  let state: VectorState<any> = {
    operationsInTime: [],
    operationsInOrder: [],
    operationsTable: {},
    visibleOperations: [],
    result: [],
  }

  return {
    getValue: () => state.result,
    insert(item: any, index = NaN) {
      if (!isNaN(index) && !(index in state.visibleOperations)) {
        throw new OutOfRangeError()
      }
      let insertBefore = state.visibleOperations[index]?.id || null
      let operation: VectorInsertOperation<any> = {
        insertBefore,
        id: Math.random().toString(),
        time: performance.now(),
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
        time: performance.now(),
        type: VECTOR_DELETE,
      }
      state = next(state, operation)
    },
    syncronize(operation) {
      state = next(state, operation)
    },
  }
}
