import { insertAt } from './insertAt.js'

it('inserts the only item', () => {
  let result = insertAt([], 1, 0)
  expect(result).toEqual([1])
})

it('inserts the last item', () => {
  let result = insertAt([1], 2, 1)
  expect(result).toEqual([1, 2])
})

it('inserts the first item', () => {
  let result = insertAt([2], 1, 0)
  expect(result).toEqual([1, 2])
})
