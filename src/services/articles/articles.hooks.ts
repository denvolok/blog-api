import { authenticate } from '@feathersjs/authentication';
import protectPrivateArticles from './hooks/protect-private-articles';
import exposeUserData from '../../hooks/expose-user-data';
import populateArticleContent from './hooks/populate-article-content';
import updateArticleContentFile from './hooks/update-article-content-file';
import { authorPermission, limitToUser, setUserId } from '../../hooks/common';
import populateArticleComments from './hooks/populate-article-comments';
import contentSearch from './hooks/content-search';

const { required } = require('feathers-hooks-common');

export default {
  before: {
    all: [],
    find: [contentSearch()],
    get: [populateArticleComments],
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
    get: [exposeUserData(), protectPrivateArticles(), populateArticleContent()],
    create: [populateArticleContent()],
    update: [populateArticleContent()],
    patch: [populateArticleContent()],
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
