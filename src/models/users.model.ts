import { Sequelize, DataTypes } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {

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
      defaultValue: [],
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
    this.hasMany(models.comments, {
      onDelete: 'CASCADE',
      hooks: true,
      foreignKey: { name: 'userId', allowNull: false },
    });

    this.hasMany(models.articles, {
      onDelete: 'CASCADE',
      hooks: true,
      foreignKey: { name: 'userId', allowNull: false },
    });


    this.belongsToMany(models.users, {
      through: 'subscribers',
      as: 'subscriptions',
      foreignKey: 'userId',
    });

    this.belongsToMany(models.users, {
      through: 'subscribers',
      as: 'subs',
      foreignKey: 'authorId',
    });
  };

  return users;
}
