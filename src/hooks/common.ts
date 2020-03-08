import { SyncValidatorFn } from 'feathers-hooks-common';
import { BadRequest } from '@feathersjs/errors';
import checkPermissions from 'feathers-permissions';
import { setField } from 'feathers-authentication-hooks';


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
