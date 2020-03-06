import { Hook, HookContext } from '@feathersjs/feathers';


/**
 * Allows restrict access to the services to a specific group
 */
const authByUserRole = (allowedRole = 'follower'): Hook => async (context: HookContext) => {
  const { userRole } = context.params.user;

  if (userRole !== allowedRole) throw new Error(`Not accessible for ${userRole}`);

  return context;
};

export default authByUserRole;
