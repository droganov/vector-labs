import { arrayInsert } from './arrayInsert.js'
import { VECTOR_INSERT, VECTOR_INSERTED } from './constants.js'
import { VectorOperation, VectorState } from './createVector.js'

interface ApplyInsertOperation {
  <Item>(
    state: Pick<VectorState<Item>, 'operationsInOrder' | 'operationsInTime'>,
    data: {
      operation: VectorOperation<Item>
      timeIndex: number
      orderIndex: number
    },
  ): Pick<VectorState<Item>, 'operationsInOrder' | 'operationsInTime'>
}

export const applyInsertOperation: ApplyInsertOperation = (
  { operationsInOrder, operationsInTime },
  { operation, timeIndex, orderIndex },
) => {
  if (operation.type === VECTOR_INSERT || operation.type === VECTOR_INSERTED) {
    return {
      operationsInTime: arrayInsert(operationsInTime, operation, timeIndex),
      operationsInOrder: arrayInsert(operationsInOrder, operation, orderIndex),
    }
  }
  return { operationsInOrder, operationsInTime }
}
