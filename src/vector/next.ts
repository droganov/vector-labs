import { findOrderIndex } from './findOrderIndex.js'
import { findTimeIndex } from './findTimeIndex.js'
import { insertOperation } from './insertOperation.js'
import { takeVisibleOperations } from './takeVisibleOperations.js'
import { updateTableOrder } from './updateTableOrder.js'
import { VectorOperation, VectorState } from './vector.js'

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

  let operationsInTime = insertOperation(
    state.operationsInTime,
    operation,
    timeIndex,
  )

  // TODO: apply vectorOperation
  let operationsInOrder = insertOperation(
    state.operationsInOrder,
    operation,
    orderIndex,
  )

  let operationsTable = updateTableOrder(state, operationsInOrder, orderIndex)

  let visibleOperations = takeVisibleOperations(
    operationsInOrder,
    operationsTable,
  )

  return {
    operationsInTime,
    operationsInOrder,
    operationsTable,
    visibleOperations,
  }
}
