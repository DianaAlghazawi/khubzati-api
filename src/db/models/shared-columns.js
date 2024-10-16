module.exports = (sequelize, DataTypes) => ({
  //   createdAt: {
  //     type: DataTypes.DATE,
  //     allowNull: false,
  //     defaultValue: DataTypes.NOW,
  //     field: 'created_at',
  //   },
  //   updatedAt: {
  //     type: DataTypes.DATE,
  //     field: 'updated_at',
  //     allowNull: false,
  //     defaultValue: DataTypes.NOW,
  //   },
  //   deletedAt: {
  //     type: DataTypes.DATE,
  //     field: 'deleted_at',
  //   },
  createdBy: {
    type: DataTypes.INTEGER,
    field: 'created_by',
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    field: 'updated_by',
  },
});
