import {
  commitTypes,
  VECTOR_DELETE,
  VECTOR_DELETED,
  VECTOR_INSERT,
  VECTOR_INSERTED,
} from './constants.js'
import { VectorOperation, VectorRecord } from './createVector.js'

interface ApplyVectorOperation {
  <Item>(
    operationsTable: VectorRecord<Item>,
    operation: VectorOperation<Item>,
    order: number,
  ): { operationsTable: VectorRecord<Item>; reOrderFrom: number }
}

export type ApplyVectorOperationResult = ReturnType<ApplyVectorOperation>

export const applyVectorOperation: ApplyVectorOperation = (
  operationsTable,
  operation,
  order,
) => {
  let confirmCount = commitTypes.has(operation.type) ? 1 : 0
  let patch = { [operation.id]: { order, undoCount: 0, confirmCount } }
  switch (operation.type) {
    case VECTOR_INSERT:
    case VECTOR_INSERTED:
      return {
        operationsTable: {
          ...operationsTable,
          ...patch,
          [operation.id]: { order, undoCount: 0, confirmCount: 0 },
        },
        reOrderFrom: order,
      }
    case VECTOR_DELETE:
    case VECTOR_DELETED: {
      let targetOperation = operationsTable[operation.operationId]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!targetOperation) {
        throw new Error(
          `Vector: operation "${operation.operationId}" not found`,
        )
      }
      let reOrderFrom = Math.min(order, targetOperation.order)
      return {
        operationsTable: {
          ...operationsTable,
          [operation.operationId]: {
            ...targetOperation,
            undoCount: targetOperation.undoCount + 1,
          },
          ...patch,
        },
        reOrderFrom,
      }
    }

    default:
      throw new Error('Unknown vector operation type')
  }
}
