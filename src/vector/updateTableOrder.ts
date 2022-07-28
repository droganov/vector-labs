import { VectorOperation, VectorRecord, VectorState } from './vector.js'

interface UpdateTableOrder {
  <State>(
    state: VectorState<State>,
    operations: VectorOperation<State>[],
    skip: number,
  ): VectorRecord
}

export const updateTableOrder: UpdateTableOrder = (
  { operationsTable },
  operations,
  skip,
) =>
  operations.slice(skip).reduce(
    (acc, operation, index) => ({
      ...acc,
      [operation.id]: {
        ...acc[operation.id],
        order: index + skip,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        undoCount: acc[operation.id]?.undoCount || 0,
      },
    }),
    operationsTable,
  )
