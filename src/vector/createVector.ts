import { next } from './next.js'

// #region Types
export type AnyOperation = { id: string; time: number; type: string }

type OperationId = AnyOperation['id']

type VectorInsertOperation<Item> = AnyOperation & {
  insertBefore: OperationId | null
  payload: Item
  type: 'vector/insert'
}
type VectorInsertedOperation<Item> = AnyOperation & {
  insertBefore: OperationId | null
  payload: Item
  type: 'vector/inserted'
}
type LoguxProcessedOperation = AnyOperation & {
  operationId: OperationId
  type: 'logux/processed'
}

export type VectorClientOperation<Item> = VectorInsertOperation<Item>
export type VectorRemoteOperation<Item> =
  | VectorInsertedOperation<Item>
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
        throw new Error('Vector: index out of range')
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
    syncronize() {},
  }
}