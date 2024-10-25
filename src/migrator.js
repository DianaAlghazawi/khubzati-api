const { Umzug, SequelizeStorage } = require('umzug');
const db = require('./db/models');
let sequelize = db.sequelize;

const umzug = new Umzug({
  migrations: { glob: 'src/db/migrations/*.js' },
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
  context: sequelize.getQueryInterface(),
});

// umzug.on('migrating', (migration) => console.log(`${migration.name} migrating`));
// umzug.on('migrated', (migration) => console.log(`${migration.name} migrated`));
// umzug.on('reverting', (migration) => console.log(`${migration.name} reverting`));
// umzug.on('reverted', (migration) => console.log(`${migration.name} reverted`));

const logStatus = (pending, executed) => {
  console.log('---------');
  console.log(
    JSON.stringify(
      {
        current: executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>',
        executed: executed.map((m) => m.file),
        pending: pending.map((m) => m.file),
      },
      null,
      2
    )
  );
  console.log('---------');
};

/**
 * Print migrations status.
 */
const cmdStatus = async () => {
  const executed = (await umzug.executed()).map((migration) => ({
    ...migration,
    name: path.basename(migration.file, '.js'),
  }));

  const pending = (await umzug.pending()).map((migration) => ({
    ...migration,
    name: path.basename(migration.file, '.js'),
  }));

  logStatus(pending, executed);
  return { executed, pending };
};

/**
 * Apply all migrations.
 */
const cmdMigrate = () => umzug.up();

/**
 * Apply next migration.
 */
const cmdMigrateNext = async () => {
  const { pending } = await cmdStatus();
  if (pending.length === 0) {
    return Promise.reject(new Error('No pending migrations'));
  }
  return umzug.up({ to: pending[0].name });
};

/**
 * Undo all migrations.
 */
const cmdReset = () => umzug.down({ to: 0 });

/**
 * Undo previous migration.
 */
const cmdResetPrev = async () => {
  const { executed } = await cmdStatus();

  if (executed.length === 0) {
    return Promise.reject(new Error('Already at initial state'));
  }
  return umzug.down({ to: executed[executed.length - 1].name });
};

/**
 * Drop and recreate the database.
 */
const cmdHardReset = async () => {
  try {
    const { database, username } = db.sequelize.config;
    console.log(`dropdb ${database}`);
    childProcess.spawnSync(`dropdb ${database}`);
    console.log(`createdb ${database} --username ${username}`);
    childProcess.spawnSync(`createdb ${database} --username ${username}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

/**
 * Get command function.
 *
 * @param {string} cmd Command name.
 */
const getCommandFunc = (cmd) => {
  switch (cmd) {
    case 'status':
      return cmdStatus;

    case 'up':
    case 'migrate':
      return cmdMigrate;

    case 'next':
    case 'migrate-next':
      return cmdMigrateNext;

    case 'down':
    case 'reset':
      return cmdReset;

    case 'prev':
    case 'reset-prev':
      return cmdResetPrev;

    case 'reset-hard':
      return cmdHardReset;

    default:
      return null;
  }
};

/**
 * Run command.
 *
 * @param {string} cmd Command name.
 */
const runCommand = async (cmd) => {
  try {
    const func = getCommandFunc(cmd);
    if (!func) {
      console.log(`invalid cmd: ${cmd}`);
      process.exit(1);
    }

    console.log(`${cmd.toUpperCase()} BEGIN`);
    await func(process.argv.length > 3 ? process.argv[3].trim() : null);
    const doneStr = `${cmd.toUpperCase()} DONE`;
    console.log(doneStr);
    console.log('='.repeat(doneStr.length));

    if (cmd !== 'status' && cmd !== 'reset-hard') {
      cmdStatus();
    }
    process.exit(0);
  } catch (error) {
    const errorStr = `${cmd.toUpperCase()} ERROR`;
    console.log(errorStr);
    console.log('='.repeat(errorStr.length));
    console.log(error);
    console.log('='.repeat(errorStr.length));
    process.exit(1);
  }
};

runCommand(process.argv[2].trim());
