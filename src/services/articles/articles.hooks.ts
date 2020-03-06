import { authenticate } from '@feathersjs/authentication';
import authByUserRole from '../../hooks/auth-by-user-role';
import protectPrivateArticles from '../../hooks/protect-private-articles';
import exposeUserData from '../../hooks/expose-user-data';


export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), authByUserRole('author')],
    update: [authenticate('jwt'), authByUserRole('author')],
    patch: [authenticate('jwt'), authByUserRole('author')],
    remove: [authenticate('jwt'), authByUserRole('author')],
  },

  after: {
    all: [],
    find: [],
    get: [exposeUserData(), protectPrivateArticles()],
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
