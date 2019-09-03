#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const marvin = require("./marvin_node.js")

program
  .version("1.0.0")
  .description("Train and use neural networks as language models")

let textFilePath;
let targetPath;
let trainOptions;
let trainData;
program
  .command('train <textFilePath> <targetPath>')
  .option('-i, --iterations <iterations>', 'The amount of times the script will cycle through the input file', 10000)
  .option('-b, --bufferlength <bufferlength>', 'The amount of characters the network will look back in order to generate the next character', 12)
  .option('-l, --learningrate <learningrate>', 'A scalar that changes the speed of the learning of a network', 0.01)
  .option('-c, --continuefrom <continuepath>', "If you've run this script before, you can continue training the same network, define the path to the output file here")
  .alias('t')
  .description('Train a network with a text file')
  .action((_textFilePath, _targetPath, options) => {
    console.log("=======================================\n" +
      "  __  __                      _        \n" +
      " |  \\/  |                    (_)       \n" +
      " | \\  / |  __ _  _ __ __   __ _  _ __  \n" +
      " | |\\/| | / _` || '__|\\ \\ / /| || '_ \\ \n" +
      " | |  | || (_| || |    \\ V / | || | | |\n" +
      " |_|  |_| \\__,_||_|     \\_/  |_||_| |_|\n" +
      "=======================================");
    console.log("[MARVIN] Initializing...");

    trainOptions = options;
    textFilePath = _textFilePath;
    targetPath = _targetPath;
    options.iterations = parseInt(options.iterations);
    options.bufferlength = parseInt(options.bufferlength);
    options.learningrate = parseFloat(options.learningrate);

    fs.readFile(_textFilePath, "utf-8", (error, data) => {
      trainData = data.split("");

      fs.readFile("./charlist.json", "utf-8", (error, data) => {
        charlist = JSON.parse(data);

        check(trainData, charlist);
        console.log("[MARVIN] Done initializing");
        pretrain();
      });
    });
  });

program
  .command('generate <path> <inputText>')
  .option('-c, --characters <characters>', 'The amount of characters to generate', 100)
  .alias('g')
  .description('Generate characters from a trained model')
  .action((path, inputText, options) => {
    console.log("=======================================\n" +
      "  __  __                      _        \n" +
      " |  \\/  |                    (_)       \n" +
      " | \\  / |  __ _  _ __ __   __ _  _ __  \n" +
      " | |\\/| | / _` || '__|\\ \\ / /| || '_ \\ \n" +
      " | |  | || (_| || |    \\ V / | || | | |\n" +
      " |_|  |_| \\__,_||_|     \\_/  |_||_| |_|\n" +
      "=======================================");
    console.log(`[MARVIN] Generating ${options.characters} characters from the model ${path}`);

    fs.readFile("./charlist.json", "utf-8", (error, data) => {
      charlist = JSON.parse(data);

      n = new marvin.network(path, () => {
        console.log(`[MARVIN] COMBINED:\n   "${generate(inputText, n, options.characters)}"`);
      });
    });
  });

program.parse(process.argv);

// GENERATE
function generate(input, network, chars) {
  let inputArray = input.split("");
  console.log(`[MARVIN] INPUT:\n   "${input}"`);
  while (inputArray.length > network.network[0].length) {
    inputArray.shift();
  }
  for (let i in inputArray) {
    inputArray[i] = letterToIndex(inputArray[i]);
  }

  let output = [];
  for (let i = 0; i < chars; i++) {
    let networkOutput = network.feed(inputArray);
    let maxValueIndex = networkOutput.indexOf(Math.max(...networkOutput));
    output.push(indexToLetter(maxValueIndex));

    inputArray.push(maxValueIndex);
    inputArray.shift();
    // console.log(indexToLetter(maxValueIndex));
  }
  console.log(`[MARVIN] OUTPUT:\n   "${output.join("")}"`);
  return input + output.join("");
}

// TRAIN
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
let n;
function pretrain() {
  console.log("[MARVIN] Starting training...");
  if (!trainOptions.continuefrom) {
    n = new marvin.network([trainOptions.bufferlength, 50, 50, 50, 50, 50, charlist.length], trainOptions.learningrate);
    console.log("[MARVIN] Created network");
    train();
  } else {
    n = new marvin.network();
    n.load(trainOptions.continuefrom, train);
  }
}
function train() {
  if (trainOptions.continuePath) console.log(`[MARVIN] Loaded network from ${trainOptions.continuePath}`);
  n.learningRate = trainOptions.learningrate;
  for (let i = 0; i < trainOptions.iterations; i++) {
    console.log(`[MARVIN] Started training epoch ${i + 1}/${trainOptions.iterations}`);

    let cost = [];
    for (let j = 2 * trainOptions.bufferlength; j < trainData.length + trainOptions.bufferlength - 1; j++) {
      // console.log(`[MARVIN]     Started training subepoch ${j}/${trainData.length + trainOptions.bufferlength - 1}`);
      // console.log(`[MARVIN]     Started training subepoch ${j - 2 * trainOptions.bufferlength + 1}/${trainData.length}`);

      let input = [];
      let output = []
      let outputIndex = letterToIndex(trainData[j - trainOptions.bufferlength]);

      for (let l = 0; l < charlist.length; l++) {
        if (l == outputIndex) output.push(1)
        else output.push(0);
      }

      for (let k = 1; k <= trainOptions.bufferlength; k++) {
        input.unshift(letterToIndex(trainData[j - k - trainOptions.bufferlength]));
      }

      cost.push(n.train(input, output));
    }
    let averageCost = 0;
    for (let k in cost) {
      averageCost += cost[k] / cost.length;
    }
    console.log(`[MARVIN] Finished training epoch ${i + 1}/${trainOptions.iterations} (${(((i + 1) / trainOptions.iterations) * 100).toFixed(2)}%) | Average cost: ${averageCost.toFixed(4)}`);
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

//BOTH
function letterToIndex(letter) {
  return charlist.findIndex((element) => {
    return element == letter;
  });
}
function indexToLetter(index) {
  return charlist[index];
}
