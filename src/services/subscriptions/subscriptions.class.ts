import { Id, Params } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { Application } from '../../declarations';


interface Data {
  authorId: Id;
}

interface ServiceOptions {}

/**
 * 'Get' methods not implemented, because 'user' model can populate subscriptions.
 */
export class Subscriptions {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // TODO:
  // - payment gateway
  // - error handling
  // - add 'subscriber' role
  // eslint-disable-next-line class-methods-use-this
  async create(data: Partial<Data>, params: Params) {
    const { user, author } = params;

    if (user.id === author.id) {
      throw new BadRequest('Author equals user');
    }

    await user.addSubscription(author);

    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  async remove(id: Id, params: Params) {
    const { user, author } = params;

    const subscription = await user.removeSubscription(author);

    if (!subscription) {
      throw new BadRequest('Subscription not found');
    }

    return null;
  }
}
