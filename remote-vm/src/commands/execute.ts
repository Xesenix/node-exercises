import colors from 'colors';
import { Readable } from 'stream';
import vm from 'vm';

export const createExecuteCommand = (sandbox: any) => (userId: number, code: string, out: Readable) => {
	try {
		vm.createContext(sandbox as any);
		vm.runInContext(`$__result = (${ code })`, sandbox);

		const result = JSON.stringify(sandbox['$__result']);
		out.push(`${ userId }: ${ colors.blue(result) }`, 'utf-8');
	} catch(err) {
		out.push(`${ userId }: ${ colors.red('Error while executing:') } ${ colors.grey(code) }`, 'utf-8');
	}
}
