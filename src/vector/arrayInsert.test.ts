import { arrayInsert } from './arrayInsert.js'

it('inserts the only item', () => {
  let result = arrayInsert([], 1, 0)
  expect(result).toEqual([1])
})

it('inserts the last item', () => {
  let result = arrayInsert([1], 2, 1)
  expect(result).toEqual([1, 2])
})

it('inserts the first item', () => {
  let result = arrayInsert([2], 1, 0)
  expect(result).toEqual([1, 2])
})
