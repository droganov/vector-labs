import { VectorOperation, VectorRecord } from './vector.js'

interface TakeVisibleOperations {
  <Item>(
    operationsInOrder: VectorOperation<Item>[],
    operationsTable: VectorRecord,
  ): VectorOperation<Item>[]
}

export const takeVisibleOperations: TakeVisibleOperations = (
  operationsInOrder,
  operationsTable,
) => operationsInOrder.filter(({ id }) => operationsTable[id].undoCount === 0)
