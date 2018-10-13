const colors = require('colors');
const server = require('net').createServer();
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const port = 8080;
const sockets = [];

function timestamp() {
    return Date.now();
}

server.on('connection', (socket) => {
    console.log('Connected');
    sockets.push(socket);
    socket.setEncoding('utf8');
    socket.write('Welcome!\n');

    socket.on('data', (data) => {
        console.log('Received', data);
        socket.write(`${timestamp()}: ${colors.blue(decoder.write(data))}`);
    });

    socket.once('end', () => {
        console.log('Disconnected');
    });
});

server.listen(port, () => console.log(`Server listening on port ${colors.yellow(port)}\nUse ${colors.blue(`netcat`)} ${colors.grey(`(nc localhost ${port})`)} or ${colors.blue(`client`)} ${colors.grey(`(node client)`)} to connect.`));

// ===============
// process cleanup
// ===============
process.on('exit', () => {
    console.log('Process: Bye!');

    server.close();
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
    process.once(type, (err) => {
        sockets.forEach((socket) => {
            console.log('Process: Bye socket!');
            socket.write('Server closing');
            socket.destroy();
        });
        process.exit(1);
    });
});
