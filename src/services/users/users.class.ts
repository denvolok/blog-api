import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Id } from '@feathersjs/feathers';
import { Application, ServiceModels } from '../../declarations';


interface Data {
  id: Id;
  email: string;
  password: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  // this field added by sequelize after fetching corresponding associations,
  // it contains a row from 'subscriptions' table, not actual subscribers
  subscribers: ServiceModels['subscriptions'];
}


declare module '../../declarations' {
  interface ServiceModels {
    users: Data;
  }
}

export class Users extends Service {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
