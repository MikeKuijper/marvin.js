const marvin = require("./marvin_node.js");
const fs = require('fs');

console.log("=======================================\n" +
  "  __  __                      _        \n" +
  " |  \\/  |                    (_)       \n" +
  " | \\  / |  __ _  _ __ __   __ _  _ __  \n" +
  " | |\\/| | / _` || '__|\\ \\ / /| || '_ \\ \n" +
  " | |  | || (_| || |    \\ V / | || | | |\n" +
  " |_|  |_| \\__,_||_|     \\_/  |_||_| |_|\n" +
  "=======================================");
console.log("[MARVIN] Initializing...");

let iterations = 1000;
let bufferlength = 10;
let charlist;
let trainData;
let continueTraining = false;
let lr = 0.01;

const args = process.argv.slice(2);
let path = args[0];
let targetPath = args[1];
if (args[2]) iterations = parseInt(args[2]);
if (args[3]) bufferlength = parseInt(args[3]);
if (args[4]) lr = parseFloat(args[4]);
let modelPath;
if (args[5] && args[5] == "-c") {
  continueTraining = true;
  modelPath = args[6];
}

fs.readFile(path, "utf-8", (error, data) => {
  trainData = JSON.parse(data.split(""));

  fs.readFile("./charlist.json", "utf-8", (error, data) => {
    charlist = JSON.parse(data);

    check(trainData, charlist);
    console.log("[MARVIN] Done initializing");
    pretrain();
  });
});

function check(d, c) {
  for (let i in d) {
    if (!c.includes(d[i])) {
      c.push(d[i]);
      fs.writeFile(`./charlist.json`, JSON.stringify(c), 'utf8', (err, data) => {
        console.log(`Found new character "${d[i]}" and added it to the charlist`);
      });
    }
  }
}

function pretrain() {
  console.log("[MARVIN] Starting training...");
  if (!continueTraining) {
    n = new marvin.network([bufferlength, 50, 50, charlist.length], lr);
    console.log("[MARVIN] Created network");
    train();
  } else {
    n = new marvin.network();
    n.load(modelPath, train);
  }
}

let n;
function train() {
  if (continueTraining) console.log(`[MARVIN] Loaded network from ${modelPath}`);
  n.learningRate = lr;
  for (let i = 0; i < iterations; i++) {
    console.log(`[MARVIN] Started training epoch ${i + 1}/${iterations}`);

    let cost = [];
    for (let j = 2 * bufferlength; j < trainData.length + bufferlength - 1; j++) {
      // console.log(`[MARVIN]     Started training subepoch ${j - 2 * bufferlength + 1}/${trainData.length}`);

      let input = [];
      let output = []
      let outputIndex = letterToIndex(trainData[j - bufferlength]);

      for (let l = 0; l < charlist.length; l++) {
        if (l == outputIndex) output.push(1)
        else output.push(0);
      }

      for (let k = 1; k <= bufferlength; k++) {
        input.unshift(letterToIndex(trainData[j - k - bufferlength]));
      }

      cost.push(n.train(input, output));
    }
    let averageCost = 0;
    for (let k in cost) {
      averageCost += cost[k] / cost.length;
    }
    console.log(`[MARVIN] Finished training epoch ${i + 1}/${iterations} (${(((i + 1) / iterations) * 100).toFixed(2)}%) | Average cost: ${averageCost.toFixed(4)}`);
  }
  console.log(`[MARVIN] Done training`);
  // console.log(generate.generate(inputText, n));

  console.log(`[MARVIN] Saving network to ${targetPath}`);
  n.save(targetPath, {}, () => {
    console.log(`[MARVIN] Done saving`);
    console.log(`[MARVIN] Exiting...`);
    process.exit();
  });
}

function letterToIndex(letter) {
  return charlist.findIndex((element) => {
    return element == letter;
  });
}

function indexToLetter(index) {
  return charlist[index];
}

// process.on('SIGINT', async function() {
//   console.log("[MARVIN] Caught interrupt signal");
//
//   console.log(`[MARVIN] Saving network to ${path.substring(0, path.lastIndexOf("."))}-model.txt`);
//   n.save(targetPath, {}, () => {
//     console.log(`[MARVIN] Done saving`);
//     console.log(`[MARVIN] Exiting...`)
//     process.exit();
//   });
// });
