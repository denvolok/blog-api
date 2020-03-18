import feathers, { HookContext } from '@feathersjs/feathers';
import express, { Application } from '@feathersjs/express';
import configuration from '@feathersjs/configuration';
import { Service } from 'feathers-sequelize';
import { DataTypes, Sequelize } from 'sequelize';
import memory from 'feathers-memory';
import sequelize from '../../sequelize';


// TODO:
// - connect actual models(with mock services/hooks)
export class TestApp {
  app: Application;
  sequelize?: Sequelize;
  setup: () => any;
  destroy: () => any;

  constructor(storageService: 'sequelize' | 'memory') {
    const app = express(feathers());

    app.configure(configuration());
    this.app = app;

    switch (storageService) {
      case 'sequelize':
        app.configure(sequelize);
        this.sequelize = app.get('sequelizeClient');

        this.setup = this.setupSequelize;
        this.destroy = this.destroySequelize;

        break;
      case 'memory':
      default:
        this.setup = this.setupMemory;
        this.destroy = this.destroyMemory;
    }
  }

  async setupSequelize() {
    // console.log('>> Running sequelize setup');

    if (!this.sequelize) throw new Error('Sequelize service not initialized');

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

  async destroySequelize() {
    await this.sequelize?.close();
  }

  async setupMemory() {
    // console.log('>> Running memory setup');
    this.app.use('/tests', memory({}));
  }

  destroyMemory = async () => null;
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
