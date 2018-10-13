// ===============
// socket handling
// ===============
const socket = require('net').createConnection({
    host: 'localhost',
    port: 8080,
});

socket.setEncoding('utf8');

const serverDataHandler = (data) => {
    console.log(`Server: ${data}`);
}

socket.on('connect', () => console.log('Connected'));
socket.on('data', serverDataHandler);
socket.on('end', () => process.exit());

// ==============
// input handling
// ==============
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const inputHandler = (line) => {
    console.log('my', line);

    if (line === 'bye') {
        process.exit();

    }

    if (!socket.destroyed) {
        socket.write(line);
    }
}
rl.on('line', inputHandler);

// ===============
// process cleanup
// ===============
process.on('exit', () => {
    console.log('Process: Bye!');

    rl.off('line', inputHandler);
    socket.off('data', serverDataHandler);
    socket.destroy();
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