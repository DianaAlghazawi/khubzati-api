const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  const sharedColumns = {
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      defaultValue: Sequelize.fn('NOW'),
    },
    createdBy: {
      type: Sequelize.UUID,
      field: 'created_by',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
    updatedBy: {
      type: Sequelize.UUID,
      field: 'updated_by',
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deleted_at',
    },
  };

  await queryInterface.createTable('roles', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.fn('uuid_generate_v4'),
    },
    role: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
    ...sharedColumns,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('roles');
}

module.exports = { up, down };
