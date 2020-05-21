const fs = require('fs');
const Parser = require('tap-parser');
const path = require('path');

async function discover(dir, ext) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const relpath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      return discover(relpath, ext);
    }
    if (path.extname(dirent.name) === ext) {
      return relpath;
    }
    return [];
  }));
  return Array.prototype.concat(...files);
}

async function collect(files) {
  const promises = [];
  files.forEach((file) => {
    const stream = fs.createReadStream(file);
    const parser = new Parser();
    promises.push(new Promise((resolve) => parser.on('complete', (results) => {
      resolve([file, results]);
    })));
    stream.pipe(parser);
  });
  const resultsArray = await Promise.all(promises);
  const results = new Map();
  resultsArray.forEach((result) => {
    const [file, data] = result;
    results.set(file, data);
  });
  return results;
}

exports.discover = discover;
exports.collect = collect;
