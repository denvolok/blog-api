module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.describeTable('users')
      .then((attrs) => {
        if (!attrs.userRole) {
          return queryInterface.addColumn(
            'users',
            'userRole',
            { type: Sequelize.ENUM('author', 'subscriber', 'follower'), defaultValue: 'follower' },
          );
        }
      }),

  down: (queryInterface, Sequelize) => queryInterface.describeTable('users')
    .then((attrs) => {
      if (attrs.userRole) {
        return queryInterface.removeColumn('users', 'userRole');
      }
    }),
};
