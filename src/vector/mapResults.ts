import { VectorClientOperation } from './createVector.js'

interface MapResults {
  <Item>(visibleOperations: VectorClientOperation<Item>[]): Item[]
}

export const mapResults: MapResults = visibleOperations =>
  visibleOperations.map(({ payload }) => payload)
