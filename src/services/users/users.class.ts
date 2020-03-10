import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Id, Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';


interface Data {
  id: Id;
  email: string;
  password: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}


declare module '../../declarations' {
  interface ServiceModels {
    'users': Data;
  }
}

export class Users extends Service {
  app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async get(id: Id, params: Params) {
    const newParams: Params = params || {};

    // Populate with additional data
    if (newParams.query && newParams.query.detailed === 'true') {
      delete newParams.query.detailed;

      newParams.sequelize = {
        ...newParams.sequelize,
        raw: false,
        include: this.app.service('comments').getModel(params),
      };
    }

    return super.get(id, newParams);
  }
}
