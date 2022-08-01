interface ArrayInsert {
  <Item>(operations: Item[], operation: Item, index: number): Item[]
}

export const arrayInsert: ArrayInsert = (operations, operation, index) => [
  ...operations.slice(0, index),
  operation,
  ...operations.slice(index),
]
