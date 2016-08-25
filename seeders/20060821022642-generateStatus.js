'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Status', [{
      name: "Done",
      createdAt : new Date(),
      updatedAt : new Date()
    },{
      name: "In Progress",
      createdAt : new Date(),
      updatedAt : new Date()
    },{
      name: "Queue",
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
