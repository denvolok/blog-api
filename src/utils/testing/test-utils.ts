import feathers, { HookContext } from '@feathersjs/feathers';
import express, { Application } from '@feathersjs/express';
import configuration from '@feathersjs/configuration';
import { Service } from 'feathers-sequelize';
import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../../sequelize';


// TODO:
// - connect actual models(with mock services/hooks)
// - constructor param to use memory/sequelize service
/**
 * Use only for sequelize, since the service may have impact on the tests performance
 */
export class TestService {
  app: Application;
  sequelize: Sequelize;

  constructor() {
    const app = express(feathers());

    app.configure(configuration());
    app.configure(sequelize);

    this.app = app;
    this.sequelize = app.get('sequelizeClient');
  }

  async setup() {
    // console.log('>> running setup');

    // Abstract testing model
    const testModel = this.sequelize.define('tests', {
      text: {
        type: DataTypes.STRING,
      },
    });

    // Drop test tables before each test suite
    await this.sequelize.getQueryInterface().dropAllTables();
    this.app.use('/tests', new Service({ Model: testModel, multi: true }));


    await this.sequelize.sync();

    return this.app;
  }

  async destroy() {
    await this.sequelize.close();
  }
}

//
export const testContext: HookContext = {
// @ts-ignore
  app: {},
  data: { id: 1 },
  id: '1',
  params: { query: { name: 'bob' }, provider: 'rest', testField: 'str' },
  result: { name: 'bob', email: 'bob@dev.com' },
};

//
export const testUser = {
  id: 1,
  email: 'first@dev.com',
  permissions: ['follower'],
  createdAt: '13/03/2020',
  updatedAt: '15/03/2020',
  comments: [],
  articles: [],
};

export const testUser2 = {
  ...testUser,
  id: 2,
  email: 'second@dev.com',
  permissions: ['author'],
};
