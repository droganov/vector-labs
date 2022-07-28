import { next } from './next.js'

export type AnyOperation = { id: string; time: number; type: string }

// #region Types
type OperationId = AnyOperation['id']

type VectorInsertOperation<Item> = AnyOperation & {
  insertBefore: OperationId | null
  payload: Item
  type: 'vector/insert'
}

export type VectorOperation<Item> = VectorInsertOperation<Item>

export type VectorState<Item> = {
  operationsInTime: VectorOperation<Item>[]
  operationsTable: Record<string, number>
  operationsInOrder: VectorOperation<Item>[]
  visibleOperations: VectorOperation<Item>[]
  result: Item[]
}

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
