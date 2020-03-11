import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Id, Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import searchInFile from '../../utils/searchInFile';
import { isPaginated } from '../../utils';


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

  async find(params: Params) {
    const { query = {} } = params;
    const { contentSearch } = query;
    delete query.contentSearch;

    const result = await super.find(params);

    if (contentSearch && isPaginated<Data>(result)) {
      const pattern = contentSearch;
      const promises = result.data.map((article) => searchInFile(article.content, pattern));
      const searchResults = await Promise.all(promises);

      result.data = result.data
        // Populate article objects with search data
        .map((article, i) => ({ ...article, search: searchResults[i] }))
        // Filter matching articles
        .filter((article) => !!article.search);
    }

    return result;
  }

  // TODO: extract to hook?
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
