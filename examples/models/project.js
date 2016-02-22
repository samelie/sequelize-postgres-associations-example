"use strict";
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define("Project", {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    uuid: {
      allowNull: false,
      type: DataTypes.STRING
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {

        Project.belongsToMany(models.User, {
          through: {
            model: models.UserProject,
            unique: false
          },
          foreignKey: 'ProjectId',
          targetKey: 'id'
        });

        Project.belongsToMany(models.Content, {
          through: {
            model: models.ProjectContent,
            unique: false
          },
          foreignKey: 'ProjectId',
          targetKey: 'id'
        });

        Project.belongsToMany(models.Tag, {
          through: {
            model: models.ProjectTag,
            unique: false
          },
          foreignKey: 'ProjectId',
          targetKey: 'id'
        });

      }
    }
  });
  return Project;
};