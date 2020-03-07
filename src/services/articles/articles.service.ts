import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Articles } from './articles.class';
import createModel from '../../models/articles.model';
import hooks from './articles.hooks';

declare module '../../declarations' {
  interface ServiceTypes {
    'articles': Articles & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  app.use('/articles', new Articles(options, app));
  const service = app.service('articles');

  service.hooks(hooks);
}
