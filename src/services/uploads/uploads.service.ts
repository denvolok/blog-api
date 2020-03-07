import { ServiceAddons } from '@feathersjs/feathers';
import { Application, BlobService } from '../../declarations';
import hooks from './uploads.hooks';

const Blob = require('feathers-blob');
const fs = require('fs-blob-store');

const blobStorage = fs('uploads');


declare module '../../declarations' {
  interface ServiceTypes {
    'uploads': BlobService.Service & ServiceAddons<any>;
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