const colors = require('colors');
const { Writable } = require('stream');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const stream = new Writable({
	write(chunk, encoding, cb) {
		console.log(`${new Date()}: ${colors.blue(decoder.write(chunk))}`);
		cb();
	}
});

process.stdin.pipe(stream);
