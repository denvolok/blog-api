import { Hook, HookContext } from '@feathersjs/feathers';


/**
 * Adds comprehensive description for the error message when using 'limitToUser' hook.
 */
export const limitToUserHandler = (): Hook => (context: HookContext) => {
  const { error = { message: '' } } = context;
  const str = ' (limited to the user)';

  if (context.params?.limitedToUser && !error.message.includes(str)) {
    error.message += str;
  }

  return context;
};
