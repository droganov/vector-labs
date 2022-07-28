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
  operationsInTime: VectorOperation<Item>[]
  operationsInOrder: VectorOperation<Item>[]
  operationsTable: Record<string, { order: number; undoCount: number }>
  visibleOperations: VectorOperation<Item>[]
  result: Item[]
}

export type VectorRecord = VectorState<unknown>['operationsTable']

interface VectorFactory {
  <Item>(): {
    insert(item: Item, index?: number): void
  }
}
// #endregion

export const Vector: VectorFactory = <Item>() => {
  let state: VectorState<Item> = {
    operationsInTime: [],
    operationsTable: {},
    operationsInOrder: [],
    visibleOperations: [],
    result: [],
  }

  return {
    insert(item: Item, index = NaN) {
      let operation: VectorInsertOperation<Item> = {
        insertBefore:
          index in state.visibleOperations
            ? state.visibleOperations[index].id
            : null,
        id: Math.random().toString(),
        time: Date.now(),
        type: 'vector/insert',
        payload: item,
      }
      state = next(state, operation)
    },
  }
}
