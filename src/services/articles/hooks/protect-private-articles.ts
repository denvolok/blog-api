import { Hook, HookContext } from '@feathersjs/feathers';
import { Forbidden } from '@feathersjs/errors';
import { ServiceModels } from '../../../declarations';


/**
 * Restrict access to private articles only for subscribers
 */
const protectPrivateArticles = (): Hook => async (context: HookContext<ServiceModels['articles']>) => {
  const { result: article } = context;

  if (article?.isPrivate) {
    const user = (context.params.user as ServiceModels['users']);

    if (!user) throw new Forbidden('Private articles only for subscribers');

    const { permissions, id: userId } = user;

    // TODO: other place
    if (!permissions.length) throw new Error('Incorrect user permissions');

    if ((!permissions.includes('subscriber') && userId !== article.userId)) {
      throw new Error('Private articles only for subscribers');
    }
  }

  return context;
};

export default protectPrivateArticles;
