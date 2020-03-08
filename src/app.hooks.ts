// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { SyncValidatorFn, validate } from 'feathers-hooks-common';
import { BadRequest } from '@feathersjs/errors';

const protectTimestamps: SyncValidatorFn = (values) => {
  if (values.createdAt || values.updatedAt) {
    throw new BadRequest('Timestamps (\'createdAt\', \'updatedAt\') can\'t be modified');
  }

  return null;
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validate(protectTimestamps)],
    update: [validate(protectTimestamps)],
    patch: [validate(protectTimestamps)],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
