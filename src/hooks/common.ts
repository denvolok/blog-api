import { SyncValidatorFn } from 'feathers-hooks-common';
import { BadRequest } from '@feathersjs/errors';
import checkPermissions from 'feathers-permissions';
import { setField } from 'feathers-authentication-hooks';
import { Hook, HookContext } from '@feathersjs/feathers';


export const protectTimestamps: SyncValidatorFn = (values) => {
  if (values.createdAt || values.updatedAt) {
    throw new BadRequest('Timestamps (\'createdAt\', \'updatedAt\') can\'t be modified');
  }

  return null;
};

export const authorPermission = checkPermissions({ roles: ['author'] });

export const setUserId = setField({
  from: 'params.user.id',
  as: 'data.userId',
});

/**
 * Restricts access to DB entities only for the owner.
 * Updates 'userId' in the request query.
 */
export const limitToUser: Hook = async (context: HookContext) => {
  // eslint-disable-next-line no-param-reassign
  context.params = {
    ...context.params,
    query: {
      ...context.params.query,
      userId: context.params.user.id,
    },
    limitedToUser: true,
  };

  return context;
};
