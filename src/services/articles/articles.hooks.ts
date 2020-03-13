import { authenticate } from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';
import { alterItems, iff, isProvider } from 'feathers-hooks-common';
import protectPrivateArticles from './hooks/protect-private-articles';
import exposeUserData from '../../hooks/expose-user-data';
import populateArticleContent from './hooks/populate-article-content';
import updateArticleContentFile from './hooks/update-article-content-file';
import { limitToUser, setUserId } from '../../hooks/common';
import contentSearch from './hooks/content-search';
import removeContentFiles from './hooks/remove-content-files';
import fetchAssociations from '../../hooks/fetch-associations';

const { required } = require('feathers-hooks-common');

export default {
  before: {
    all: [],
    find: [
      iff(isProvider('external'), contentSearch()),
    ],
    get: [fetchAssociations('comments')],
    create: [
      authenticate('jwt'),
      checkPermissions({ roles: ['author'] }),
      setUserId(),
      required('title'),
      updateArticleContentFile(),
    ],
    update: [
      authenticate('jwt'),
      limitToUser(),
      updateArticleContentFile(),
    ],
    patch: [
      authenticate('jwt'),
      limitToUser(),
      updateArticleContentFile(),
    ],
    remove: [
      authenticate('jwt'),
      limitToUser(),
    ],
  },

  after: {
    all: [],
    find: [],
    get: [
      exposeUserData(),
      protectPrivateArticles(),
      populateArticleContent(),
    ],
    create: [populateArticleContent()],
    update: [populateArticleContent()],
    patch: [populateArticleContent()],
    remove: [
      removeContentFiles(),
      // eslint-disable-next-line no-param-reassign
      alterItems((article) => (article.content = '')),
    ],
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
