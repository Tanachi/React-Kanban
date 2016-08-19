
'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cards', [{
      title : 'Do stuff',
      status : 'Queue',
      priority : 'low',
      createdBy : 'Fang',
      assignedBy: 'Someone',
      createdAt : new Date(),
      updatedAt : new Date()
    },{
      title : 'Camp invasions',
      status : 'In Progress',
      priority : 'high',
      createdBy : 'Tyler',
      assignedBy: 'James',
      createdAt : new Date(),
      updatedAt : new Date()
    },{
      title : 'Go Somewhere',
      status : 'Done',
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