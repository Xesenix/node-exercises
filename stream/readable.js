const { Readable } = require('stream');

const stream = new Readable({
    read() {

    }
});

stream.pipe(process.stdout);

const intervalHandle = setInterval(() => {
    stream.push(`${(new Date()).toString()}\n`);
}, 1000);

setTimeout(() => {
    stream.push(null);
    clearInterval(intervalHandle);
}, 10000);