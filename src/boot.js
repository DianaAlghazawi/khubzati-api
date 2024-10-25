const { exec } = require('child_process');
exec('sh ./bin/boot.sh', (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (error !== null) {
    console.log(`exec error: ${error}`);
  }
});
