import colors from 'colors';
import net from 'net';
import { Engine } from '../src/engine';


const engine = new Engine();

// ===============
// === server ====
// ===============

const port = 4000;
const server = net.createServer();

server.on('connection', (socket: net.Socket) => {
	console.log(`${ colors.green('process connected') }`);
	engine.connectSocket(socket);
});

server.on('error', (err: Error) => {
	console.error(`${ colors.red('process connected') }`, err);
});

server.listen(port, () => {
	console.log(`Server listening on port ${ colors.yellow(port.toString()) }`);
});

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
		engine.destroy();
		process.exit(1);
	});
});
