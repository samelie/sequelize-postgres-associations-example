"use strict";
module.exports = function(sequelize, DataTypes) {
  var ContentTag = sequelize.define("ContentTag", {
    ContentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: sequelize.models.Content,
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
  return ContentTag;
};