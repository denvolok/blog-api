// import app from '../src/app';
const app = require('../lib/app').default;

const env = process.env.NODE_ENV || 'development';
const dialect = 'postgres'; // Or your dialect name

module.exports = {
  [env]: {
    dialect,
    url: app.get(dialect),
    migrationStorageTableName: '_migrations',
  },
};
