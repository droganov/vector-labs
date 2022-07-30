import { VectorClientOperation, VectorState } from './vector.js'

interface FindOrderIndex {
  <Item>(
    state: VectorState<Item>,
    operation: VectorClientOperation<Item>,
  ): number
}

export const findOrderIndex: FindOrderIndex = (
  { operationsInOrder, operationsTable },
  { insertBefore },
) =>
  insertBefore ? operationsTable[insertBefore].order : operationsInOrder.length
