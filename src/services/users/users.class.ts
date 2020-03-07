import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Id } from '@feathersjs/feathers';
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
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
