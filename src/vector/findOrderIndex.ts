import { VectorInsertOperations, VectorOperation } from './createVector.js'

interface FindOrderIndex {
  <Item>(
    operationsInOrder: VectorInsertOperations<Item>[],
    operation: VectorOperation<Item>,
  ): number
}

export const findOrderIndex: FindOrderIndex = (
  operationsInOrder,
  // NOTE: some operations don't have insertBefore key, ts doesn't know that
  // @ts-ignore
  { insertBefore, time },
) => {
  let result = operationsInOrder.length

  for (let i = result; i--; i >= 0) {
    let lastOperation = operationsInOrder[i]
    if (
      insertBefore === lastOperation.insertBefore &&
      lastOperation.time < time
    ) {
      break
    }
    result = i
  }

  return result
}
