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

const visibleTypes = new Set(['vector/insert', 'vector/inserted'])

export const aggregate: Aggregate = (operationsInOrder, operationsTable) =>
  operationsInOrder.reduce(
    (acc, operation) => {
      if (
        visibleTypes.has(operation.type) &&
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
