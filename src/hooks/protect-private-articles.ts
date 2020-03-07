import { Hook, HookContext } from '@feathersjs/feathers';
import { ServiceModels } from '../declarations';


/**
 * Restrict access to private articles only for subscribers
 */
const protectPrivateArticles = (): Hook => async (context: HookContext<ServiceModels['articles']>) => {
  const { result: article } = context;
  const { permissions, id: userId } = (context.params.user as ServiceModels['users']);

  if (!article) return context;
  if (!permissions.length) throw new Error('Incorrect user permissions');

  if (article.isPrivate && (!permissions.includes('subscriber') && userId !== article.authorId)) {
    throw new Error('Private articles only for subscribers');
  }

  return context;
};

export default protectPrivateArticles;
