import feathers from '@feathersjs/feathers';
import express, { Application } from '@feathersjs/express';
import rimraf from 'rimraf';
import configuration from '@feathersjs/configuration';
import { Service as SequelizeService } from 'feathers-sequelize';
import { Sequelize } from 'sequelize';
import memory from 'feathers-memory';
import * as util from 'util';
import sequelize from '../../sequelize';


const Blob = require('feathers-blob');
const fs = require('fs-blob-store');

const blobStorage = fs('.');


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

  async createTextFile(content: string) {
    return this.app.service('uploads').create({
      id: this.getNewFileId(),
      buffer: Buffer.from(content),
      contentType: 'text/plain',
    });
  }

  // TODO: refactor when will be useful(maybe use for some services from (this.services))
  private async setupSequelize() {
    // console.log('>> Running sequelize setup');

    if (!this.sequelize) throw new Error('Sequelize service not initialized');

    await this.setupCommon();

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
    // Drop test tables after each test suite
    await this.sequelize?.getQueryInterface().dropAllTables();
    await this.sequelize?.close();
    await this.destroyCommon();
  }

  private async setupMemory() {
    // console.log('>> Running memory setup');
    await this.setupCommon();
    this.app.use('/tests', memory({ paginate: { default: 2, max: 4 } }));
  }

  private async setupCommon() {
    if (this.services.includes('uploads')) {
      const options = {
        Model: blobStorage,
        returnUri: false,
        returnBuffer: true,
      };

      this.app.use('/uploads', new Blob(options));
    }
  }

  private destroyMemory = async () => {
    await this.destroyCommon();
  };

  private destroyCommon = async () => util.promisify(rimraf)('uploads/test');

  private getNewFileId = () => `uploads/test/test.${Math.floor(Math.random() * 10e7)}.txt`;
}
