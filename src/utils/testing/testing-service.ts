import feathers from '@feathersjs/feathers';
import express, { Application } from '@feathersjs/express';
import rimraf from 'rimraf';
import configuration from '@feathersjs/configuration';
import { Service as SequelizeService } from 'feathers-sequelize';
import { Sequelize, Model, DataTypes } from 'sequelize';
import memory from 'feathers-memory';
import * as util from 'util';
import sequelize from '../../sequelize';


const Blob = require('feathers-blob');
const fs = require('fs-blob-store');

const blobStorage = fs('.');

type TestServices = ('uploads' | 'subscriptions')[];


export class TestService {
  app: Application;
  servicesToInit: TestServices;
  sequelize?: Sequelize;
  uploadsDir: string;

  constructor(servicesToInit: TestServices = []) {
    const app = express(feathers());

    app.configure(configuration());

    this.app = app;
    this.servicesToInit = servicesToInit;
    this.uploadsDir = `uploads/test_${Math.floor(Math.random() * 10e7)}`;
  }

  async setup() {
    const services = this.servicesToInit;

    if (services.includes('uploads')) {
      const options = {
        Model: blobStorage,
        returnUri: false,
        returnBuffer: true,
      };

      this.app.use('/uploads', new Blob(options));
    }

    // A service for general usage
    this.useMemory('/tests');
  }

  async useSequelize(path: string, model?: Model) {
    if (!this.sequelize) {
      this.app.configure(sequelize);
      this.sequelize = this.app.get('sequelizeClient');
    }

    const defaultModel = this.sequelize?.define(path.replace('/', ''), { text: { type: DataTypes.STRING } });
    const serviceModel = model || defaultModel;

    this.app.use(path, new SequelizeService({ Model: serviceModel, multi: true }));
    await this.sequelize?.sync();
  }

  useMemory(path: string, options: any = { paginate: { default: 2, max: 4 } }): void {
    this.app.use(path, memory(options));
  }

  async createTextFile(content: string) {
    return this.app.service('uploads').create({
      id: this.getNewFileId(),
      buffer: Buffer.from(content),
      contentType: 'text/plain',
    });
  }

  async destroy() {
    if (this.sequelize) {
      // Drop test tables after each test suite
      await this.sequelize.getQueryInterface().dropAllTables();
      await this.sequelize.close();
    }

    await Promise.all([
      util.promisify(rimraf)(this.uploadsDir),
    ]);
  }

  private getNewFileId = () => `${this.uploadsDir}/${Math.floor(Math.random() * 10e7)}.txt`;
}
