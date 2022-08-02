import { VectorInsertOperations, VectorRecord } from './createVector.js'

interface UpdateTableOrder {
  <Item>(props: {
    operationsInOrder: VectorInsertOperations<Item>[]
    operationsTable: VectorRecord<Item>
    reorderFrom: number
  }): VectorRecord<Item>
}

export const updateTableOrder: UpdateTableOrder = ({
  operationsInOrder,
  operationsTable,
  reorderFrom,
}) =>
  operationsInOrder.slice(reorderFrom).reduce(
    (acc, operation, index) => {
      if (!(operation.id in acc)) {
        throw new Error(`Key "${operation.id}" is not in operations table`)
      }
      acc[operation.id] = {
        ...acc[operation.id],
        order: reorderFrom + index,
      }
      return acc
    },
    { ...operationsTable },
  )
