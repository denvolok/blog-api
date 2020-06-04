import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import hooks from './uploads.hooks';

const Blob = require('feathers-blob');
const fs = require('fs-blob-store');

const blobStorage = fs('.');


declare module '../../declarations' {
  interface ServiceTypes {
    'uploads': ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    Model: blobStorage,
    returnUri: false,
    returnBuffer: true,
  };

  app.use('/uploads', new Blob(options));
  const service = app.service('uploads');

  service.hooks(hooks);
}
