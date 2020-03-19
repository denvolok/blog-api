import { Id, Params } from '@feathersjs/feathers';
import { BadRequest, GeneralError } from '@feathersjs/errors';
import { Application, ServiceModels } from '../../declarations';


interface Data {
  authorId: Id;
  userId: Id;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Subscription {
  authorId: Id;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Subscriber {
  subId: Id;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface ServiceOptions {}

declare module '../../declarations' {
  interface ServiceModels {
    subscriptions: Data;
  }
}

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
  // eslint-disable-next-line class-methods-use-this
  async create(data: Partial<Data>, params?: Params) {
    if (!params?.user || !params?.author) throw new GeneralError('Bad service params provided');

    const { user, author } = params;

    if (user.id === author.id) throw new BadRequest('Author equals user');

    const subscription = await user.addSubscription(author);
    if (!subscription) throw new BadRequest('User is already subscribed to the author');

    if (!user.permissions.includes('subscriber')) {
      const permissions = [...user.permissions, 'subscriber'];
      await this.app.service('users').patch(user.id, { permissions });
    }

    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  async remove(id: Id, params: Params) {
    const { user, author } = params;

    const subscription = await user.removeSubscription(author);
    if (!subscription) throw new BadRequest('Subscription not found');

    const permissions = (user as ServiceModels['users']).permissions.filter((p) => p !== 'subscriber');
    await this.app.service('users').patch(user.id, { permissions });

    return null;
  }
}
