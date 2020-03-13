import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Id } from '@feathersjs/feathers';
import { Application } from '../../declarations';


interface Data {
  id: Id;
  title: string;
  categories: string[];
  isPrivate: boolean;
  content: string;
  userId: Id;
  createdAt: Date;
  updatedAt: Date;
}

declare module '../../declarations' {
  interface ServiceModels {
    articles: Data;
  }
}

export class Articles extends Service<Data> {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
