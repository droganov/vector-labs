import { VectorOperation, VectorRecord } from './vector.js'

interface UpdateTableOrder {
  <Item>(
    operationsTable: VectorRecord,
    operations: VectorOperation<Item>[],
    skip: number,
  ): VectorRecord
}

export const updateTableOrder: UpdateTableOrder = (
  operationsTable,
  operations,
  skip,
) =>
  operations.slice(skip).reduce(
    (acc, operation, index) => {
      if (!(operation.id in acc)) {
        throw new Error(`Key "${operation.id}" is not in operations table`)
      }
      acc[operation.id] = {
        ...acc[operation.id],
        order: index + skip,
      }
      return acc
    },
    { ...operationsTable },
  )
