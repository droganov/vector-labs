import { VectorOperation, VectorState } from './vector.js'

interface FindOrderIndex {
  <State>(state: VectorState<State>, operation: VectorOperation<State>): number
}

export const findOrderIndex: FindOrderIndex = (
  { operationsInOrder, operationsTable },
  { insertBefore },
) =>
  insertBefore ? operationsTable[insertBefore].order : operationsInOrder.length
