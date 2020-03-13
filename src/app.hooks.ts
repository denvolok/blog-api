// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { validate } from 'feathers-hooks-common';
import { protectTimestamps } from './hooks/common';
import { limitToUserHandler } from './hooks/error-handlers';


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
    all: [limitToUserHandler()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
