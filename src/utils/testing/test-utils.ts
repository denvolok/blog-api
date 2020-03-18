import feathers, { HookContext } from '@feathersjs/feathers';
import express, { Application } from '@feathersjs/express';
import configuration from '@feathersjs/configuration';
import { Service as SequelizeService } from 'feathers-sequelize';
import { Sequelize } from 'sequelize';
import memory from 'feathers-memory';
import sequelize from '../../sequelize';


export class TestService {
  app: Application;
  services: string[];
  sequelize?: Sequelize;
  setup: () => any;
  destroy: () => any;

  constructor(storageService: 'sequelize' | 'memory' = 'memory', servicesToInit?: string[]) {
    const app = express(feathers());

    app.configure(configuration());
    this.app = app;
    this.services = servicesToInit || [];

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

  private async setupSequelize() {
    // console.log('>> Running sequelize setup');

    if (!this.sequelize) throw new Error('Sequelize service not initialized');

    // Drop test tables before each test suite
    await this.sequelize.getQueryInterface().dropAllTables();

    const promises = this.services.map((service) => Promise.resolve()
      .then(() => import(`../../models/${service}.model.ts`))
      .then((createModel) => {
        // Associations ignored
        this.app.use(`/${service}`, new SequelizeService({ Model: createModel.default(this.app), multi: true }));
      }));

    await Promise.all(promises);
    await this.sequelize.sync();

    return this.app;
  }

  private async destroySequelize() {
    await this.sequelize?.close();
  }

  private async setupMemory() {
    // console.log('>> Running memory setup');
    this.app.use('/tests', memory({}));
  }

  private destroyMemory = async () => null;
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
