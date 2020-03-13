// Initializes the `subscriptions` service on path `/subscriptions`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Subscriptions } from './subscriptions.class';
import hooks from './subscriptions.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'subscriptions': Subscriptions & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {};

  app.use('/subscriptions', new Subscriptions(options, app));
  const service = app.service('subscriptions');

  service.hooks(hooks);
}
