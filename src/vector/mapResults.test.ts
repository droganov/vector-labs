import { mapResults } from './mapResults.js'

it('maps payload', () => {
  let result = mapResults([
    {
      id: 'a',
      time: 1,
      type: 'vector/insert',
      insertBefore: null,
      payload: 'a',
    },
  ])

  expect(result).toEqual(['a'])
})
