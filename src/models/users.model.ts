import { DataTypes, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const users = sequelizeClient.define('Users', {

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.ENUM('author', 'subscriber', 'follower')),
      defaultValue: ['follower'],
    },

  }, {
    hooks: {
      beforeCount(options: any) {
        // eslint-disable-next-line no-param-reassign
        options.raw = true;
      },
    },
  });

  (users as any).associate = function (models: any) {
    this.hasMany(models.Comments, {
      onDelete: 'CASCADE',
      hooks: true,
      foreignKey: { name: 'userId', allowNull: false },
    });

    this.hasMany(models.Articles, {
      onDelete: 'CASCADE',
      hooks: true,
      foreignKey: { name: 'userId', allowNull: false },
    });
  };

  return users;
}
