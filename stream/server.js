const colors = require('colors');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const server = require('http').createServer((request, response) => {
    const dataPath = path.resolve('data/big.txt');
    console.log('got request', dataPath);

    // serving big file via stream to reduce memory consumption
    // with additional gzip
    fs.createReadStream(dataPath).pipe(zlib.createGzip()).pipe(response);
});

const port = 8080;

server.listen(port, () => console.log(`Server listening on port ${colors.yellow(port)}\nUse ${colors.blue('curl')} or ${colors.blue('browser')} to connect.`));

// ===============
// process cleanup
// ===============
process.on('exit', () => {
    console.log('Process: Bye!');
});

// in case there are some other kill process signals
[
    // ctrl+c
    `SIGINT`,
    // other kill pid
    `SIGUSR1`,
    `SIGUSR2`,
    // errors
    `uncaughtException`,
    // ???
    `SIGTERM`,
].forEach((type) => {
    process.on(type, (err) => {
        console.error(type, err);
    
        process.exit(1);
    });
});