interface InsertAt {
  <Item>(operations: Item[], operation: Item, index: number): Item[]
}

export const insertOperation: InsertAt = (operations, operation, index) => [
  ...operations.slice(0, index),
  operation,
  ...operations.slice(index),
]
