import { VectorOperation, VectorState } from './createVector.js'

interface FindOrderIndex {
  <Item>(state: VectorState<Item>, operation: VectorOperation<Item>): number
}

export const findOrderIndex: FindOrderIndex = (
  { operationsInOrder, operationsTable },
  // NOTE: some operations don't have insertBefore key, ts doesn't know that
  // @ts-ignore
  { insertBefore },
) =>
  insertBefore ? operationsTable[insertBefore].order : operationsInOrder.length
