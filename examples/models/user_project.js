"use strict";
module.exports = function(sequelize, DataTypes) {
  var UserProject = sequelize.define("UserProject", {
    ProjectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: sequelize.models.Project,
        key: 'id'
      },
      referencesKey: "id"
    },
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: sequelize.models.User,
        key: "id"
      }
    }

  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return UserProject;
};