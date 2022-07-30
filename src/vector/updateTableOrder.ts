import { ApplyVectorOperationResult } from './applyVectorOperation.js'
import { VectorClientOperation, VectorRecord } from './createVector.js'

interface UpdateTableOrder {
  <Item>(
    unorderedOperation: ApplyVectorOperationResult,
    operations: VectorClientOperation<Item>[],
  ): VectorRecord
}

export const updateTableOrder: UpdateTableOrder = (
  { operationsTable, reOrderFrom },
  operations,
) =>
  operations.slice(reOrderFrom).reduce(
    (acc, operation, index) => {
      if (!(operation.id in acc)) {
        throw new Error(`Key "${operation.id}" is not in operations table`)
      }
      acc[operation.id] = {
        ...acc[operation.id],
        order: reOrderFrom + index,
      }
      return acc
    },
    { ...operationsTable },
  )
