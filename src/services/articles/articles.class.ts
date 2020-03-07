import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Id, Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';


interface Data {
  id: Id;
  title: string;
  categories: string[];
  isPrivate: boolean;
  content: string;
  authorId: Id;
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

  async create(data: Data, params: Params) {
    const updatedData = {
      ...data,
      authorId: params.user.id,
    };

    return super.create(updatedData, params);
  }

  async remove(id: Id, params: Params) {
    const article = await super.remove(id, params);

    await this.app.service('uploads').remove(article.content);
    article.content = '';

    return article;
  }
}
