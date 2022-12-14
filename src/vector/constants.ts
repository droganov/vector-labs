export const LOGUX_PROCESSED = 'logux/processed'
export const LOGUX_UNDO = 'logux/undo'

export const VECTOR_INSERT = 'vector/insert'
export const VECTOR_INSERTED = 'vector/inserted'
export const VECTOR_DELETE = 'vector/delete'
export const VECTOR_DELETED = 'vector/deleted'

export const commitTypes = new Set([VECTOR_INSERTED, VECTOR_DELETED])
export const insertTypes = new Set([VECTOR_INSERT, VECTOR_INSERTED])

export const loguxEvents = new Set([LOGUX_PROCESSED, LOGUX_UNDO])
