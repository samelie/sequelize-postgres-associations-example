"use strict";
module.exports = function(sequelize, DataTypes) {
  var ProjectContent = sequelize.define("ProjectContent", {
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
    ContentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: sequelize.models.Content,
        key: "id"
      }
    }
  }, {
    classMethods: {
      associate: function(models) {}
    }
  });
  return ProjectContent;
};