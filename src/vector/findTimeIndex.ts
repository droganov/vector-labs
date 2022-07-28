import { AnyOperation } from './vector.js'

interface FindTimeIndex {
  (operations: AnyOperation[], operation: AnyOperation): number
}

export const findTimeIndex: FindTimeIndex = (operations, operation) => {
  for (let i = operations.length; i--; i >= 0) {
    if (operation.time >= operations[i].time) {
      return i + 1
    }
  }
  return 0
}
