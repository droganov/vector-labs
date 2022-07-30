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
  let patch = { [operation.id]: { order, undoCount: 0, confirmCount: 0 } }
  switch (operation.type) {
    case 'vector/insert':
    case 'vector/inserted':
      return {
        operationsTable: {
          ...operationsTable,
          ...patch,
          [operation.id]: { order, undoCount: 0, confirmCount: 0 },
        },
        reOrderFrom: order,
      }
    case 'vector/delete':
    case 'vector/deleted': {
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
