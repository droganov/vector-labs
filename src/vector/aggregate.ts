import { VectorInsertOperations, VectorRecord } from './createVector.js'

interface Aggregate {
  <Item>(
    operationsInOrder: VectorInsertOperations<Item>[],
    operationsTable: VectorRecord<Item>,
  ): {
    visibleOperations: VectorInsertOperations<Item>[]
    result: Item[]
  }
}

export const aggregate: Aggregate = (operationsInOrder, operationsTable) =>
  operationsInOrder.reduce(
    (acc, operation) => {
      if (
        'payload' in operation &&
        operationsTable[operation.id].undoCount === 0
      ) {
        acc.visibleOperations.push(operation)
        acc.result.push(operation.payload)
      }
      return acc
    },
    {
      visibleOperations: [] as VectorInsertOperations<any>[],
      result: [] as any[],
    },
  )
