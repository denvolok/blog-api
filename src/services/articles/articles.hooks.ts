import { authenticate } from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';
import protectPrivateArticles from '../../hooks/protect-private-articles';
import exposeUserData from '../../hooks/expose-user-data';
import populateArticle from '../../hooks/populate-article';
import updateArticleContentFile from '../../hooks/update-article-content-file';

const { required } = require('feathers-hooks-common');

const authorPermission = checkPermissions({ roles: ['author'] });


export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), authorPermission, required('title'), updateArticleContentFile()],
    update: [authenticate('jwt'), authorPermission, required('title'), updateArticleContentFile()],
    patch: [authenticate('jwt'), authorPermission, updateArticleContentFile()],
    remove: [authenticate('jwt'), authorPermission],
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
