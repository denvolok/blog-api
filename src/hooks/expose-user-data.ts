import { Hook, HookContext } from '@feathersjs/feathers';


/**
 * Expose user data through 'context.params.user'.
 * Useful for cases where we can't use 'authenticate' hook (e.g. all after-hooks).
 */
const exposeUserData = (): Hook => async (context: HookContext) => {
  const [jwtStrategy] = await context.app.service('authentication').getStrategies('jwt');
  const authData = await jwtStrategy.parse(context.params);
  let user = {};

  // If user authenticated
  if (authData) {
    const { accessToken } = await jwtStrategy.parse(context.params);
    const auth = await jwtStrategy.authenticate({ accessToken }, context.params);

    user = auth.user;
  }

  // eslint-disable-next-line no-param-reassign
  context.params.user = user;

  return context;
};

export default exposeUserData;
