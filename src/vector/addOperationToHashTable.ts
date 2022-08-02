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
  VectorDeleteOperationState,
  VectorInsertOperations,
  VectorInsertsOperationState,
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
    case VECTOR_INSERTED: {
      let hash: VectorInsertsOperationState = {
        order,
        undoCount: 0,
        confirmCount,
      }
      nextOperationsTable = {
        ...operationsTable,
        [operation.id]: hash,
      }
      break
    }
    case VECTOR_DELETE:
    case VECTOR_DELETED: {
      let referencedOperationHash = operationsTable[
        operation.operationId
      ] as VectorInsertsOperationState
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!referencedOperationHash) {
        throw new Error(
          `Vector: operation "${operation.operationId}" not found`,
        )
      }
      reorderFrom = Math.min(order, referencedOperationHash.order)

      let hash: VectorDeleteOperationState = {
        confirmCount,
        operation,
        undoCount: 0,
      }

      nextOperationsTable = {
        ...operationsTable,
        [operation.operationId]: {
          ...referencedOperationHash,
          undoCount: referencedOperationHash.undoCount + 1,
        },
        [operation.id]: hash,
      }
      break
    }
    case LOGUX_UNDO: {
      let targetOperationHash = operationsTable[operation.id]

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!targetOperationHash) {
        throw new Error(`Vector: operation "${operation.id}" not found`)
      }
      let redo
      let deleteOperation = targetOperationHash.operation
      if (operation.id === 'bb') {
        console.log('operation.id: ', targetOperationHash)
      }
      if (deleteOperation) {
        let insertOperationHash = operationsTable[
          deleteOperation.operationId
        ] as VectorInsertsOperationState
        redo = {
          [deleteOperation.operationId]: {
            ...insertOperationHash,
            undoCount: insertOperationHash.undoCount - 1,
          },
        }
        reorderFrom = Math.min(order, insertOperationHash.order)
      }
      nextOperationsTable = {
        ...operationsTable,
        ...redo,
        [operation.id]: {
          ...targetOperationHash,
          undoCount: targetOperationHash.undoCount + 1,
          confirmCount: targetOperationHash.confirmCount + 1,
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
