module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        id: 'bd81ac9b-4bba-4483-a88c-3b01b54f6c55',
        role: 'Admin',
      },
      {
        id: '5fa44afd-e944-4a5a-abe1-bb782892c30f',
        role: 'Bakery',
      },
      {
        id: 'd3304475-e1f6-40ae-9453-8f2950b14366',
        role: 'Restaurant',
      },
      {
        id: 'ac8de7d7-0b1e-4618-b095-c0793e724703',
        role: 'Driver',
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', {
      id: [
        'bd81ac9b-4bba-4483-a88c-3b01b54f6c55',
        '5fa44afd-e944-4a5a-abe1-bb782892c30f',
        'd3304475-e1f6-40ae-9453-8f2950b14366',
        'ac8de7d7-0b1e-4618-b095-c0793e724703',
      ],
    });
  },
};
