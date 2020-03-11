import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Id, Paginated, Params } from '@feathersjs/feathers';
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

export class Articles extends Service<Data> {
  app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async get(id: Id, params: Params) {
    const updatedParams = {
      ...params,
      sequelize: {
        ...params.sequelize,
        raw: false,
        include: this.app.service('comments').getModel(params),
      },
    };

    return super.get(id, updatedParams);
  }

  async remove(id: Id, params: Params) {
    const article = await super.remove(id, params);

    if (article instanceof Array) {
      const promises = article.map((a) => this.app.service('uploads').remove(a.content));

      await Promise.all(promises);
    } else {
      await this.app.service('uploads').remove(article.content);
      article.content = '';
    }

    return article;
  }
}
