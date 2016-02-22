"use strict";
module.exports = function(sequelize, DataTypes) {
  var CategoryContent = sequelize.define("CategoryContent", {
    CategoryId: DataTypes.INTEGER,
    ContentId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        CategoryContent.belongsTo(models.Category);
        CategoryContent.belongsTo(models.Tag);
      }
    }
  });
  return CategoryContent;
};