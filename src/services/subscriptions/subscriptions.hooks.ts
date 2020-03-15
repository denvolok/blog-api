import * as authentication from '@feathersjs/authentication';
import { required } from 'feathers-hooks-common';
import setUserAndAuthor from './hooks/set-user-and-author';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      required('authorId'),
      setUserAndAuthor(),
    ],
    update: [],
    patch: [],
    remove: [
      setUserAndAuthor(),
    ],
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