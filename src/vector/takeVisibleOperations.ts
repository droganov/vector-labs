import { VectorClientOperation, VectorRecord } from './vector.js'

interface TakeVisibleOperations {
  <Item>(
    operationsInOrder: VectorClientOperation<Item>[],
    operationsTable: VectorRecord,
  ): VectorClientOperation<Item>[]
}

export const takeVisibleOperations: TakeVisibleOperations = (
  operationsInOrder,
  operationsTable,
) => operationsInOrder.filter(({ id }) => operationsTable[id].undoCount === 0)
