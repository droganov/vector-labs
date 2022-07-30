import { applyVectorOperation } from './applyVectorOperation.js'
import { findOrderIndex } from './findOrderIndex.js'
import { findTimeIndex } from './findTimeIndex.js'
import { insertOperation } from './insertOperation.js'
import { mapResults } from './mapResults.js'
import { takeVisibleOperations } from './takeVisibleOperations.js'
import { updateTableOrder } from './updateTableOrder.js'
import { VectorClientOperation, VectorState } from './createVector.js'

interface Next {
  <Item>(
    state: VectorState<Item>,
    operation: VectorClientOperation<Item>,
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

  let operationsInOrder = insertOperation(
    state.operationsInOrder,
    operation,
    orderIndex,
  )

  let unorderedOperation = applyVectorOperation(
    state.operationsTable,
    operation,
    orderIndex,
  )

  let operationsTable = updateTableOrder(unorderedOperation, operationsInOrder)

  let visibleOperations = takeVisibleOperations(
    operationsInOrder,
    operationsTable,
  )

  let result = mapResults(visibleOperations)

  return {
    operationsInTime,
    operationsInOrder,
    operationsTable,
    visibleOperations,
    result,
  }
}
