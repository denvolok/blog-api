import { authenticate } from '@feathersjs/authentication';
import protectPrivateArticles from '../../hooks/protect-private-articles';
import exposeUserData from '../../hooks/expose-user-data';
import populateArticle from '../../hooks/populate-article';
import updateArticleContentFile from '../../hooks/update-article-content-file';
import { authorPermission, setUserId } from '../../hooks/common';

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
      required('title', 'userId'),
      updateArticleContentFile(),
    ],
    update: [authenticate('jwt'), authorPermission, updateArticleContentFile()],
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
