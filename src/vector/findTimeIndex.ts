import { VECTOR_INSERT, VECTOR_INSERTED } from './constants.js'
import { VectorInsertOperations, VectorOperation } from './createVector.js'

interface FindTimeIndex {
  <Item>(
    operationsInTime: VectorInsertOperations<Item>[],
    operation: VectorOperation<Item>,
  ): number
}

export const findTimeIndex: FindTimeIndex = (operationsInTime, operation) => {
  if (operation.type !== VECTOR_INSERT && operation.type !== VECTOR_INSERTED) {
    return 0
  }
  for (let i = operationsInTime.length; i--; i >= 0) {
    if (operation.time >= operationsInTime[i].time) {
      return i + 1
    }
  }
  return 0
}
