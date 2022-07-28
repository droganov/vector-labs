import { AnyOperation } from './index.js'

interface FindIndex {
  (operations: AnyOperation[], operation: AnyOperation): number
}

export const findIndex: FindIndex = (operations, operation) => {
  for (let i = operations.length; i--; i >= 0) {
    if (operation.time >= operations[i].time) {
      return i + 1
    }
  }
  return 0
}
