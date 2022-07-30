import { OutOfRangeError } from './OutOfRangeError.js'

it('extends Error', () => {
  let error = new OutOfRangeError()
  expect(error instanceof Error).toBe(true)
})

it('has name', () => {
  let error = new OutOfRangeError()
  expect(error.name).toBe('OutOfRangeError')
})

it('has message', () => {
  let error = new OutOfRangeError()
  expect(error.message).toBe('Vector: index out of range')
})
