import { Sequelize, DataTypes } from 'sequelize';
import { Application } from '../declarations';

export default function (app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const comments = sequelizeClient.define('comments', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    hooks: {
      beforeCount(options: any) {
        // eslint-disable-next-line no-param-reassign
        options.raw = true;
      },
    },
    validate: {
      hasForeignKeys() {
        if (!this.userId) {
          throw new Error('Missing required field \'authorId\'');
        }
        if (!this.articleId) {
          throw new Error('Missing required field \'articleId\'');
        }
      },
    },
  });

  (comments as any).associate = function (models: any) {
    this.belongsTo(models.users);
  };

  return comments;
}
