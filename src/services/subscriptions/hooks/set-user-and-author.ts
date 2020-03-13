import { Hook, HookContext } from '@feathersjs/feathers';
import { GeneralError } from '@feathersjs/errors';


/**
 * Fetch sequelize models(instead of raw queries) and pass them through 'params'
 * for consuming in the service methods.
 */
const setUserAndAuthor = (): Hook => async (context: HookContext) => {
  const { app, params, data, method, id = 0 } = context;
  const { id: userId } = params.user;
  let authorId = 0;

  switch (method) {
    case 'create':
      authorId = data.authorId;
      break;
    case 'remove':
      authorId = Number(id);
      break;
    default:
      throw new GeneralError(`'${method}' method for 'setUserAndAuthor' hook is not supported`);
  }

  const [user, author] = await Promise.all([
    app.service('users').get(userId, { sequelize: { raw: false } }),
    app.service('users').get(authorId, { sequelize: { raw: false } }),
  ]);

  // eslint-disable-next-line no-param-reassign
  context.params = { ...params, user, author };

  return context;
};


export default setUserAndAuthor;
