import { Sequelize, DataTypes } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const articles = sequelizeClient.define('articles', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Private articles are only for subscribers',
    },
    content: {
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
  });

  (articles as any).associate = function (models: any) {
    this.belongsTo(models.users);
    this.hasMany(models.comments, { onDelete: 'CASCADE', hooks: true });
  };

  return articles;
}
