import { VectorOperation, VectorState } from './vector.js'

interface FindOrderIndex {
  (state: VectorState<unknown>, operation: VectorOperation<unknown>): number
}

export const findOrderIndex: FindOrderIndex = (
  { operationsInOrder, operationsTable },
  { insertBefore },
) => (insertBefore ? operationsTable[insertBefore] : operationsInOrder.length)
