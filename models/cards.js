'use strict';
module.exports = function(sequelize, DataTypes) {
  var Cards = sequelize.define('Cards', {
    title: DataTypes.STRING,
    priority: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    assignedBy: DataTypes.STRING
  }, {
    tableName: "Cards",
    classMethods: {
      associate: function(models) {
        models.Cards.belongsTo(models.Status, {
          foreignKey: 'status_id',
          as: 'status'
        });
      }
    }
  });
  return Cards;
};