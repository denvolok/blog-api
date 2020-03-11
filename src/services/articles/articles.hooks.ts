import { authenticate } from '@feathersjs/authentication';
import protectPrivateArticles from '../../hooks/protect-private-articles';
import exposeUserData from '../../hooks/expose-user-data';
import populateArticle from '../../hooks/populate-article';
import updateArticleContentFile from '../../hooks/update-article-content-file';
import { authorPermission, limitToUser, setUserId } from '../../hooks/common';

const { required } = require('feathers-hooks-common');

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      authorPermission,
      setUserId,
      required('title'),
      updateArticleContentFile(),
    ],
    update: [authenticate('jwt'), limitToUser, updateArticleContentFile()],
    patch: [authenticate('jwt'), limitToUser, updateArticleContentFile()],
    remove: [authenticate('jwt'), limitToUser],
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
