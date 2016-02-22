"use strict";
module.exports = function(sequelize, DataTypes) {
  var Content = sequelize.define("Content", {
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
    platform: DataTypes.STRING,
    platformQuery: DataTypes.STRING,
    platformId: DataTypes.STRING,
    platformCreatedAt: DataTypes.STRING,
    platformTags: DataTypes.STRING(8192),
    platformText: DataTypes.STRING(8192),
    platformGeo: DataTypes.STRING,
    platformRanking: DataTypes.INTEGER,
    fileStats: DataTypes.STRING(10240),
    contentData: DataTypes.STRING(10240),
    platformData: DataTypes.TEXT,
    name: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    codecs: DataTypes.STRING,
    url: DataTypes.STRING,
    bucket: DataTypes.STRING,
    etag: DataTypes.STRING,
    categoryIds: DataTypes.STRING,
    mpd: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Content.belongsToMany(models.Project, {
          through: {
            model: models.ProjectContent,
            unique: false
          },
          foreignKey: 'ContentId',
          targetKey: 'id'
        });

        Content.belongsToMany(models.Tag, {
          through: {
            model: models.ContentTag,
            unique: false
          },
          foreignKey: 'ContentId',
          targetKey: 'id'
        });
      }
    }
  });
  return Content;
};