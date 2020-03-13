import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Id } from '@feathersjs/feathers';
import { Application } from '../../declarations';


interface Data {
  id: Id;
  text: string;
  articleId: Id;
  userId: Id;
  createdAt: Date;
  updatedAt: Date;
}

declare module '../../declarations' {
  interface ServiceModels {
    comments: Data;
  }
}

export class Comments extends Service {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
