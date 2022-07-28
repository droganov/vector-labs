import { VectorOperation } from './vector.js'

interface MapResults {
  <Item>(visibleOperations: VectorOperation<Item>[]): Item[]
}

export const mapResults: MapResults = visibleOperations =>
  visibleOperations.map(({ payload }) => payload)
