"use strict";
module.exports = function(sequelize, DataTypes) {
  var ProjectCategory = sequelize.define("ProjectCategory", {
    ProjectId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        ProjectCategory.belongsTo(models.Project);
        ProjectCategory.belongsTo(models.Category);
      }
    }
  });
  return ProjectCategory;
};