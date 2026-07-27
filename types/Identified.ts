/**
 * Represents an object that has been assigned a unique identifier.
 */
export type Identified<Object> =
  & Object
  & {
    /**
     * id of `Object`
     */
    get id(): string;
  };
