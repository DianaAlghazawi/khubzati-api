const express = require('express');

const { sequelize } = require('./db/models');

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).json({
    status: 'suceess',
    data: 'welcome',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
});

app.listen(process.env.APP_PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
