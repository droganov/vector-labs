import {
  commitTypes,
  LOGUX_PROCESSED,
  LOGUX_UNDO,
  VECTOR_DELETE,
  VECTOR_DELETED,
  VECTOR_INSERT,
  VECTOR_INSERTED,
} from './constants.js'
import {
  VectorInsertOperations,
  VectorOperation,
  VectorRecord,
} from './createVector.js'
import { updateTableOrder } from './updateTableOrder.js'

interface ApplyVectorOperation {
  <Item>(props: {
    operationsTable: VectorRecord<Item>
    operation: VectorOperation<Item>
    operationsInOrder: VectorInsertOperations<Item>[]
    order: number
  }): VectorRecord<Item>
}

export type ApplyVectorOperationResult = ReturnType<ApplyVectorOperation>

export const addOperationToHashTable: ApplyVectorOperation = ({
  operationsTable,
  operation,
  operationsInOrder,
  order,
}) => {
  let confirmCount = commitTypes.has(operation.type) ? 1 : 0

  let nextOperationsTable: VectorRecord<unknown>
  let reorderFrom = order

  switch (operation.type) {
    case VECTOR_INSERT:
    case VECTOR_INSERTED:
      nextOperationsTable = {
        ...operationsTable,
        [operation.id]: { order, undoCount: 0, confirmCount },
      }
      break
    case VECTOR_DELETE:
    case VECTOR_DELETED: {
      let targetOperation = operationsTable[operation.operationId]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!targetOperation) {
        throw new Error(
          `Vector: operation "${operation.operationId}" not found`,
        )
      }
      reorderFrom = Math.min(order, targetOperation.order)
      nextOperationsTable = {
        ...operationsTable,
        [operation.operationId]: {
          ...targetOperation,
          undoCount: targetOperation.undoCount + 1,
        },
        [operation.id]: { order: -1, undoCount: 0, confirmCount },
      }
      break
    }
    case LOGUX_UNDO: {
      let targetOperation = operationsTable[operation.id]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!targetOperation) {
        throw new Error(`Vector: operation "${operation.id}" not found`)
      }
      reorderFrom = Math.min(order, targetOperation.order)
      nextOperationsTable = {
        ...operationsTable,
        [operation.id]: {
          ...targetOperation,
          undoCount: targetOperation.undoCount + 1,
          confirmCount: targetOperation.confirmCount + 1,
        },
      }
      break
    }
    case LOGUX_PROCESSED: {
      let targetOperation = operationsTable[operation.id]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!targetOperation) {
        throw new Error(`Vector: operation "${operation.id}" not found`)
      }
      nextOperationsTable = {
        ...operationsTable,
        [operation.id]: {
          ...targetOperation,
          confirmCount: targetOperation.confirmCount + 1,
        },
      }
      break
    }

    default:
      throw new Error('Unknown vector operation type')
  }

  return updateTableOrder({
    operationsTable: nextOperationsTable,
    operationsInOrder,
    reorderFrom: Math.max(reorderFrom - 1, 0),
  })
}
