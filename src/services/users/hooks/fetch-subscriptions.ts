import { Hook, HookContext } from '@feathersjs/feathers';
import { ServiceModels } from '../../../declarations';


/**
 * Populate user object with 'subscribers' and 'subscriptions' fields.
 * Only public data.
 * Use as 'after' hook.
 */
const fetchSubscriptions = (): Hook => async (context: HookContext) => {
  const { app } = context;
  const { id } = context.result;

  const user = await app.service('users').get(id, { sequelize: { raw: false } });

  // eslint-disable-next-line no-param-reassign
  context.result.subscriptions = await user.getSubscriptions()
    .then((subscriptions: ServiceModels['users'][]) => subscriptions.map((sub) => ({
      authorId: sub.id,
      createdAd: sub.subscribers.createdAt,
      updatedAt: sub.subscribers.updatedAt,
    })));

  if (user.permissions.includes('author')) {
    // eslint-disable-next-line no-param-reassign
    context.result.subscribers = await user.getSubs()
      .then((subscriptions: ServiceModels['users'][]) => subscriptions.map((sub) => ({
        subId: sub.id,
        createdAd: sub.subscribers.createdAt,
        updatedAt: sub.subscribers.updatedAt,
      })));
  }

  return context;
};


export default fetchSubscriptions;
