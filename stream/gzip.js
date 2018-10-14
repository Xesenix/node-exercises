const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];
const { Transform } = require('stream');
// Transform is duplex stream that handles write and read actions inside transform method
const progress = new Transform({
    transform(chunk, encoding, cb) {
        process.stdout.write('.');
        cb(null, chunk);
    }
})

fs.createReadStream(file)
    .pipe(zlib.createGzip())
    // alternative progress
    // .on('data', () => process.stdout.write('.'))
    .pipe(progress)
    .pipe(fs.createWriteStream(`${file}.gz`))
    .on('finish', () => process.stdout.write('Done\n'));
