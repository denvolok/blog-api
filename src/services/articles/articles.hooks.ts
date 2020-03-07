import { authenticate } from '@feathersjs/authentication';
import authByUserRole from '../../hooks/auth-by-user-role';
import protectPrivateArticles from '../../hooks/protect-private-articles';
import exposeUserData from '../../hooks/expose-user-data';
import populateArticle from '../../hooks/populate-article';
import updateArticleContentFile from '../../hooks/update-article-content-file';

const { required } = require('feathers-hooks-common');


export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), authByUserRole('author'), required('title'), updateArticleContentFile()],
    update: [authenticate('jwt'), authByUserRole('author'), required('title'), updateArticleContentFile()],
    patch: [authenticate('jwt'), authByUserRole('author'), updateArticleContentFile()],
    remove: [authenticate('jwt'), authByUserRole('author')],
  },

  after: {
    all: [],
    find: [],
    get: [exposeUserData(), protectPrivateArticles(), populateArticle()],
    create: [populateArticle()],
    update: [populateArticle()],
    patch: [populateArticle()],
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
