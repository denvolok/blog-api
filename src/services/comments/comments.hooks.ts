import * as authentication from '@feathersjs/authentication';
import { limitToUser, setUserId } from '../../hooks/common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), setUserId()],
    update: [authenticate('jwt'), limitToUser()],
    patch: [authenticate('jwt'), limitToUser()],
    remove: [authenticate('jwt'), limitToUser()],
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
