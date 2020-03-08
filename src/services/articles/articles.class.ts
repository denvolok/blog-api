import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Id, Params } from '@feathersjs/feathers';
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
    'articles': Data;
  }
}

export class Articles extends Service {
  app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async remove(id: Id, params: Params) {
    const article = await super.remove(id, params);

    await this.app.service('uploads').remove(article.content);
    article.content = '';

    return article;
  }
}
