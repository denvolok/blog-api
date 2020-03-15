import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { iff, isProvider } from 'feathers-hooks-common';
import fetchAssociations from '../../hooks/fetch-associations';
import fetchSubscriptions from './hooks/fetch-subscriptions';
import disallowFields from '../../hooks/disallow-fields';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [
      authenticate('jwt'),
      iff(isProvider('rest'), fetchAssociations('comments', 'articles')),
    ],
    create: [
      disallowFields('permissions'),
      hashPassword('password'),
    ],
    update: [
      disallowFields('permissions'),
      hashPassword('password'),
      authenticate('jwt'),
    ],
    patch: [
      disallowFields('permissions'),
      hashPassword('password'),
      authenticate('jwt'),
    ],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [protect('password')],
    find: [],
    get: [
      iff(isProvider('rest'), fetchSubscriptions()),
    ],
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
