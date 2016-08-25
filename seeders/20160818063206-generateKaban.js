
'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cards', [{
      title : 'Do stuff',
      status_id : 1,
      priority : 'low',
      createdBy : 'Fang',
      assignedBy: 'Someone',
      createdAt : new Date(),
      updatedAt : new Date()
    },{
      title : 'Camp invasions',
      status_id : 2,
      priority : 'high',
      createdBy : 'Tyler',
      assignedBy: 'James',
      createdAt : new Date(),
      updatedAt : new Date()
    },{
      title : 'Go Somewhere',
      status_id : 3,
      priority : 'medium',
      createdBy : 'Everyone',
      assignedBy: 'Noone',
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Cards');
  }
};