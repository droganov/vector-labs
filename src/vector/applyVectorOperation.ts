import { VectorOperation, VectorRecord } from './vector.js'

interface ApplyVectorOperation {
  <Item>(
    operationsTable: VectorRecord,
    operation: VectorOperation<Item>,
    order: number,
  ): { operationsTable: VectorRecord; reOrderFrom: number }
}

export type ApplyVectorOperationResult = ReturnType<ApplyVectorOperation>

export const applyVectorOperation: ApplyVectorOperation = (
  operationsTable,
  operation,
  order,
) => {
  switch (operation.type) {
    case 'vector/insert':
      return {
        operationsTable: {
          ...operationsTable,
          [operation.id]: { order, undoCount: 0 },
        },
        reOrderFrom: order,
      }

    default:
      throw new Error('Unknown vector operation type')
  }
}
