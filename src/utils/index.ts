import { Paginated } from '@feathersjs/feathers';

/**
 * Type guard function for services methods results.
 */
export function isPaginated<T>(result: T[] | Paginated<T>): result is Paginated<T> {
  return !Array.isArray(result);
}
