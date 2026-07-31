/**
 * Main module for the ObjectRepository.
 * Exports the generic repository interface and its Storage implementation.
 */

export type { ObjectRepository } from "./types/ObjectRepository.ts";
export type { ClassFactory } from "./types/ClassFactory.ts";
export type { SaveAble } from "./types/SaveAble.ts";
export type { Serializable } from "./types/Serializable.ts";
export { StorageRepo } from "./lib/StorageRepo.ts";
export { RamRepo } from "./lib/RamRepo.ts";
