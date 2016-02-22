"use strict";
module.exports = function(sequelize, DataTypes) {
  var ProjectTag = sequelize.define("ProjectTag", {
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
    TagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: sequelize.models.Tag,
        key: "id"
      }
    }
  }, {
    classMethods: {
    }
  });
  return ProjectTag;
};