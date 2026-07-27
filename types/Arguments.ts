import type { Serializable } from "./Serializable.ts";

/**
 * Represents a collection of arguments for object loading and saving.
 */
export type Arguments = Record<string, Serializable>;
