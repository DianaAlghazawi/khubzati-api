const express = require('express');

const { sequelize } = require('./db/models');
const authRouter = require('./routes/authRoute');
const { Role } = require('./db/models');

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).json({
    status: 'suceess',
    data: 'welcome',
  });
});

app.use('/api/v1/auth', authRouter);

app.use('*', (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
});

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
