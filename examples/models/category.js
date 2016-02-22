"use strict";
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    uuid:{
      allowNull: false,
      type: DataTypes.STRING
    },
    projectId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Category.belongsToMany(models.Project, {
          through: models.ProjectCategory
        });

        Category.belongsToMany(models.Content, {
          through: models.CategoryContent
        });
      }
    }
  });
  return Category;
};