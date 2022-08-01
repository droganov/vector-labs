import { applyVectorOperation } from './applyVectorOperation.js'
import { findOrderIndex } from './findOrderIndex.js'
import { findTimeIndex } from './findTimeIndex.js'
import { updateTableOrder } from './updateTableOrder.js'
import { VectorOperation, VectorState } from './createVector.js'
import { aggregate } from './aggregate.js'
import { applyInsertOperation } from './applyInsertOperation.js'

interface Next {
  <Item>(
    state: VectorState<Item>,
    operation: VectorOperation<Item>,
  ): VectorState<Item>
}

export const next: Next = (state, operation) => {
  if (operation.id in state.operationsTable) return state

  let timeIndex: number = findTimeIndex(state.operationsInTime, operation)
  let orderIndex: number = findOrderIndex(state, operation)

  let unorderedOperation = applyVectorOperation(
    state.operationsTable,
    operation,
    orderIndex,
  )

  let { operationsInTime, operationsInOrder } = applyInsertOperation(state, {
    operation,
    timeIndex,
    orderIndex,
  })

  let operationsTable = updateTableOrder(unorderedOperation, operationsInOrder)

  let { visibleOperations, result } = aggregate(
    operationsInOrder,
    operationsTable,
  )

  return {
    operationsInTime,
    operationsInOrder,
    operationsTable,
    visibleOperations,
    result,
  }
}
