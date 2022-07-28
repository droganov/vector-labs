import { findTimeIndex } from './findTimeIndex.js'

it('returns 0 for the first operation', () => {
  let index = findTimeIndex([], { id: 'a', time: 1, type: 'a' })
  expect(index).toBe(0)
})

it('returns 1 for the second operation', () => {
  let index = findTimeIndex([{ id: 'a', time: 1, type: 'a' }], {
    id: 'b',
    time: 2,
    type: 'a',
  })
  expect(index).toBe(1)
})

it('returns 0 when operations need to be swapped', () => {
  let index = findTimeIndex([{ id: 'a', time: 2, type: 'a' }], {
    id: 'b',
    time: 1,
    type: 'a',
  })
  expect(index).toBe(0)
})
