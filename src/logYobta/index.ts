import { observableYobta, StorePlugin, ObservableStore } from '../index.js'
import { findIndex } from './findIndex.js'
import { insertAt } from './insertAt.js'

// #region Types
export type AnyOperation = { id: string; time: number }

interface LogFactory {
  <Operation extends AnyOperation>(
    initialState: Operation[],
    ...listeners: StorePlugin<Operation[]>[]
  ): ObservableStore<Operation[]> & {
    add(operation: Operation): number
  }
}
// #endregion

export const logYobta: LogFactory = <Operation extends AnyOperation>(
  initialState: Operation[],
  ...listeners: StorePlugin<Operation[]>[]
) => {
  let store = observableYobta(initialState, ...listeners)

  return {
    ...store,
    add(operation: Operation) {
      let lastState = store.last()
      if (lastState.some(({ id }) => id === operation.id)) {
        return -1
      }
      let index = findIndex(lastState, operation)
      let nextState = insertAt(lastState, operation, index)
      store.next(nextState, { index })

      return index
    },
  }
}
