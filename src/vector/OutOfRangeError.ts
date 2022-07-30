export class OutOfRangeError extends Error {
  constructor() {
    super('Vector: index out of range')
    this.name = 'OutOfRangeError'
  }
}
