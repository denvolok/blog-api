import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';


interface ArticleData {
  categories: string[];
  isPrivate: boolean;
  content: string;
}

export class Articles extends Service {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }

  async create(data: ArticleData, params: Params) {
    const { categories, isPrivate, content } = data;
    const articleData = {
      categories,
      isPrivate,
      // TODO: write content to a file and provide the file path
      contentFilePath: 'mock_path',
      authorId: params.user.id,
    };

    return super.create(articleData, params);
  }
}
