'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    //  return Promise.all([
    //   queryInterface.addColumn(
    //     'User', // table name
    //     'email', // new field name
    //     {
    //       type: Sequelize.STRING,
    //       allowNull: true,
    //       after: 'phone'
    //     },
    //   ),
    // ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.removeColumn('User', 'email', { transaction: t }),
      ])
  })
  }
};
