const fs = require('fs');
const path = require('path');
const server = require('http').createServer((request, response) => {
    const dataPath = path.resolve('data/big.txt');
    console.log('got request', dataPath);

    // serving big file via stream to reduce memory consumption
    fs.createReadStream(dataPath).pipe(response);
});

server.listen(8080);

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