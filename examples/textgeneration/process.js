const fs = require('fs');

// let path = './data/data1.txt';
let path;
let targetPath;

console.log("=======================================\n" +
  "  __  __                      _        \n" +
  " |  \\/  |                    (_)       \n" +
  " | \\  / |  __ _  _ __ __   __ _  _ __  \n" +
  " | |\\/| | / _` || '__|\\ \\ / /| || '_ \\ \n" +
  " | |  | || (_| || |    \\ V / | || | | |\n" +
  " |_|  |_| \\__,_||_|     \\_/  |_||_| |_|\n" +
  "=======================================");
console.log(`[MARVIN] Processing ${path} to ${targetPath}`);

const args = process.argv.slice(2);
path = args[0];
if (args[1]) targetPath = args[1];
else targetPath = `${path.substring(0, path.lastIndexOf("."))}-processed.json`

fs.readFile(path, "utf8", function read(err, data) {
  if (err) {
    throw err;
  }

  console.log(`[MARVIN] CONTENT:\n  "${data}"`);
  processFile(data);
});

function processFile(content) {
  content = content.split('');
  console.log(`[MARVIN] Writing to output file ${targetPath}`);
  fs.writeFile(targetPath, JSON.stringify(content), 'utf8', (err, data) => {
    if (data) console.log(data);
    // console.log("===========");
    if (err) throw err;
    console.log(`[MARVIN] Done`)
  });
}
