import { Duplex } from 'stream';
import { StringDecoder } from 'string_decoder';
import net from 'net';

import { createExecuteCommand } from './commands/execute';

const decoder = new StringDecoder('utf-8');
const sandbox: any = {};
const executeCommand = createExecuteCommand(sandbox);

interface IUser {
	socket: net.Socket;
	userStream: Duplex;
}

export class Engine {
	nextUserId = 0;
	users: IUser[] = [];
	globalOut = new Duplex({
		read() {},
		write(chunk, encoding, cb) {
			cb();
		}
	});

	public connectSocket(socket: net.Socket) {
		const userId = this.nextUserId++;
		const userStream = this.createUser(userId);
		this.users[userId] = {
			socket,
			userStream,
		};
		socket.pipe(userStream).pipe(socket);
		this.globalOut.pipe(socket);

		socket.once('end', () => this.disconnectSocket(socket));
	}

	public disconnectSocket(socket: net.Socket) {
		const user: IUser | undefined = this.users.find((item) => socket === item.socket);
		if (typeof user !== 'undefined') {
			const { userStream } = user;
			this.users = this.users.filter((item) => socket !== item.socket);
			socket.unpipe(userStream);
			userStream.unpipe(socket);
			this.globalOut.unpipe(socket);
		}
	}

	createUser(userId: number) {
		const globalOut = this.globalOut;
		return new Duplex({
			read(size: number) {
				const time = new Date();
				console.log(`User input [${ time.toLocaleTimeString() }]`);
				/*setTimeout(() => {
					console.log(`Respone to [${ time.toLocaleTimeString() }] at ${ (new Date()).toLocaleTimeString() }`);
					this.push(`[${ time.toLocaleTimeString() }] Anything interesting?`, 'utf-8');
				}, 5000);*/
			},

			write(chunk, encoding, cb) {
				const command: string = decoder.write(chunk);
				console.log('User input', command);
				if (command.startsWith('/w')) {
					const message = command.substr(3);
					globalOut.push(`${ userId }: ${ message }`, 'utf-8');
					setTimeout(() => this.push('thanks', 'utf-8'), 1000);
				} else if (command.startsWith('/e')) {
					executeCommand(globalOut, userId, command.substr(3));
				} else if (command === '/myid') {
					const message = command;
					globalOut.push(`${ userId }`, 'utf-8');
				} else {
					const message = command;
					globalOut.push(`${ userId }: ${ message }`, 'utf-8');
				}
				cb();
			}
		});
	}

	destroy() {
		this.users.forEach(({ socket }) => {
			console.log('Process: Bye socket!');
			this.disconnectSocket(socket);
			socket.write('[Server closing]');
			socket.destroy();
		});
	}
}
