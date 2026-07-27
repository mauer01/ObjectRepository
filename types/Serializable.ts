/**
 * Represents a value that can be safely serialized.
 */
export type Serializable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | Serializable[];
