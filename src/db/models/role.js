'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {}
  }
  Role.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Role',
    }
  );
  return Role;
};
