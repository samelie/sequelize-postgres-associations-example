"use strict";
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
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
    facebookId: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Project, {
          through: {
            model: models.UserProject,
            unique: false
          },
          foreignKey: 'UserId',
          targetKey:'id'
        });
      }
    }
  });
  return User;
};