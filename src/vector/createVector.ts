import { next } from './next.js'
import { OutOfRangeError } from './OutOfRangeError.js'

// #region Types
export type AnyOperation = { id: string; time: number; type: string }

export type OperationId = AnyOperation['id']

export type VectorInsertOperation<Item> = AnyOperation & {
  insertBefore: OperationId | null
  payload: Item
  type: 'vector/insert'
}
export type VectorInsertedOperation<Item> = AnyOperation & {
  insertBefore: OperationId | null
  payload: Item
  type: 'vector/inserted'
}

export type VectorDeleteOperation = AnyOperation & {
  operationId: OperationId
  type: 'vector/delete'
}
export type VectorDeletedOperation = AnyOperation & {
  operationId: OperationId
  type: 'vector/deleted'
}

export type LoguxProcessedOperation = AnyOperation & {
  type: 'logux/processed'
}

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
  operationsInTime: VectorOperation<Item>[] // sorted by time
  operationsInOrder: VectorOperation<Item>[] // sorted by id-relation
  operationsTable: Record<
    OperationId,
    { order: number; undoCount: number; confirmCount: number }
  >
  visibleOperations: VectorOperation<Item>[] // operationsInOrder filtered by undoCount === 0
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
        type: 'vector/insert',
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
        type: 'vector/delete',
      }
      state = next(state, operation)
    },
    syncronize() {},
  }
}
