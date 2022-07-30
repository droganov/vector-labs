import { VectorOperation, VectorRecord } from './createVector.js'

interface Aggregate {
  <Item>(
    operationsInOrder: VectorOperation<Item>[],
    operationsTable: VectorRecord<Item>,
  ): {
    visibleOperations: VectorOperation<Item>[]
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
      visibleOperations: [] as VectorOperation<any>[],
      result: [] as any[],
    },
  )
