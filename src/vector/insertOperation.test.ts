import { insertOperation } from './insertOperation.js'

it('inserts the only item', () => {
  let result = insertOperation([], 1, 0)
  expect(result).toEqual([1])
})

it('inserts the last item', () => {
  let result = insertOperation([1], 2, 1)
  expect(result).toEqual([1, 2])
})

it('inserts the first item', () => {
  let result = insertOperation([2], 1, 0)
  expect(result).toEqual([1, 2])
})
