import { Hook, HookContext } from '@feathersjs/feathers';


/**
 * Restrict access to private articles only for subscribers
 */
const protectPrivateArticles = (): Hook => async (context: HookContext) => {
  const { result: article } = context;
  const { userRole, id: userId } = context.params.user;

  if (article.isPrivate
    && (userRole !== 'subscriber' && userId !== article.authorId)) {
    throw new Error('Private articles only for subscribers');
  }

  return context;
};

export default protectPrivateArticles;
