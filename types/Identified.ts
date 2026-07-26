export type Identified<Object> =
  & Object
  & {
    get id(): string;
  };
