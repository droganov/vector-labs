import { findIndex } from './findIndex.js'

it('returns 0 for the first operation', () => {
  let index = findIndex([], { id: 'a', time: 1 })
  expect(index).toBe(0)
})

it('returns 1 for the second operation', () => {
  let index = findIndex([{ id: 'a', time: 1 }], { id: 'b', time: 2 })
  expect(index).toBe(1)
})

it('returns 0 when operations need to be swapped', () => {
  let index = findIndex([{ id: 'a', time: 2 }], { id: 'b', time: 1 })
  expect(index).toBe(0)
})
