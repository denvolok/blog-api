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

    // Not logged user
    if (!user) throw new Forbidden('Private articles only for subscribers');

    const { id: userId } = user;
    const authorId = article.userId;
    const subscriptions = user.subscriptions?.map((sub) => sub.authorId);

    if ((!subscriptions?.includes(authorId) && userId !== authorId)) {
      throw new Forbidden('Private articles only for subscribers');
    }
  }

  return context;
};

export default protectPrivateArticles;
