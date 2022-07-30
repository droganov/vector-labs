import { next } from './next.js'

// #region Types
export type AnyOperation = { id: string; time: number; type: string }

type OperationId = AnyOperation['id']

type VectorInsertOperation<Item> = AnyOperation & {
  insertBefore: OperationId | null
  payload: Item
  type: 'vector/insert'
}

export type VectorOperation<Item> = VectorInsertOperation<Item>

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

export type VectorRecord = VectorState<unknown>['operationsTable']

interface VectorFactory {
  <Item>(): {
    getValue(): Item[]
    insert(item: Item, index?: number): void
  }
}
// #endregion

export const Vector: VectorFactory = <Item>() => {
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
      let insertBefore =
        index in state.visibleOperations
          ? state.visibleOperations[index].id
          : null
      let operation: VectorInsertOperation<Item> = {
        insertBefore,
        id: Math.random().toString(),
        time: Date.now(),
        type: 'vector/insert',
        payload: item,
      }
      state = next(state, operation)
    },
  }
}
