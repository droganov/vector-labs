import { addOperationToHashTable } from './addOperationToHashTable.js'
import { findOrderIndex } from './findOrderIndex.js'
import { findTimeIndex } from './findTimeIndex.js'
import { VectorOperation, VectorState } from './createVector.js'
import { aggregate } from './aggregate.js'
import { insertOperation } from './insertOperation.js'
import { loguxEvents } from './constants.js'

interface Next {
  <Item>(
    state: VectorState<Item>,
    operation: VectorOperation<Item>,
  ): VectorState<Item>
}

export const next: Next = (state, operation) => {
  if (
    operation.id in state.operationsTable &&
    !loguxEvents.has(operation.type)
  ) {
    return state
  }

  let timeIndex: number = findTimeIndex(state.operationsInTime, operation)
  let orderIndex: number = findOrderIndex(state.operationsInOrder, operation)

  let { operationsInTime, operationsInOrder } = insertOperation(state, {
    operation,
    timeIndex,
    orderIndex,
  })

  let operationsTable = addOperationToHashTable({
    operationsTable: state.operationsTable,
    operation,
    order: orderIndex,
    operationsInOrder,
  })

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
