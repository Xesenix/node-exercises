import colors from 'colors';
import net from 'net';
import readline from 'readline';

// ===============
// === client ====
// ===============

const port = 4000;
const socket = net.createConnection({
	host: 'localhost',
	port,
})

const connectHandler = () => {
	console.log(colors.green('connected'))
}

const dataHandler = (data: any) => {
	const time = new Date();
	console.log(`${ colors.yellow(`Server [${ time.toLocaleTimeString() }]:`) } ${ data }`);
}

const errorHandler = (err: Error) => {
	const time = new Date();
	console.error(`${ colors.yellow(`Server [${ time.toLocaleTimeString() }]:`) }`, err);
}

const endHandler = () => {
	console.log(colors.green('end'));
	process.exit();
}

socket.setEncoding('utf-8');

socket.once('connect', connectHandler);
socket.on('data', dataHandler);
socket.on('error', errorHandler);
socket.on('end', endHandler);

// ===============
// ===== cli =====
// ===============

const lineHandle = (line: any) => {
	socket.write(line);
}

const cli = readline.createInterface({
	input: process.stdin,
	output: socket,
});

cli.on('line', lineHandle);


// ===============
// === process ===
// ===============

process.on('exit', () => {
	socket.off('connect', connectHandler);
	socket.off('data', dataHandler);
	socket.off('end', endHandler);
	socket.destroy();
});

// in case there are some other kill process signals
[
	// ctrl+c
	'SIGINT',
	// other kill pid
	'SIGUSR1',
	'SIGUSR2',
	// errors
	'uncaughtException',
	// ???
	'SIGTERM',
].forEach((type: any) => {
	process.once(type, (err) => {
		console.log('Signal', type, err);
		process.exit(1);
	});
});
