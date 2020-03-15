import { Hook, HookContext } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';


/**
 * Prevents passing 'disallowed' fields from the client side.
 * Use it when the client should receive an error.
 */
const disallowFields = (...fields: string[]): Hook => (context: HookContext) => {
  // Don't run on the server calls
  if (!context.params.provider) return context;

  fields.forEach((field) => {
    if (context.data?.hasOwnProperty(field)) {
      throw new BadRequest(`'${field}' field not allowed`);
    }
  });

  return context;
};


export default disallowFields;
