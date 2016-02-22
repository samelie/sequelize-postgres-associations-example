"use strict";
module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define("Tag", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    uuid: {
      allowNull: false,
      type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    relatedUuids: DataTypes.STRING(8192),
    relatedFromUuids: DataTypes.STRING(8192),
    relatedToUuids: DataTypes.STRING(8192)
  }, {
    classMethods: {
      associate: function(models) {

        Tag.belongsToMany(models.Project, {
          through: {
            model: models.ProjectTag,
            unique: false
          },
          foreignKey: 'TagId',
          targetKey: 'id'
        });

        Tag.belongsToMany(models.Content, {
          through: {
            model: models.ContentTag,
            unique: false
          },
          foreignKey: 'TagId',
          targetKey: 'id'
        });
      }
    }
  });
  return Tag;
};