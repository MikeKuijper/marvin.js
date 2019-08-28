const marvin = require("./marvin_node.js");
const fs = require("fs");

// let inputText = "The crimso";
let chars = 100;
// let path = "./data/language1.txt";

let n;

const args = process.argv.slice(2);
let path = args[0];
let inputText = args[1];
if (args[2]) chars = parseInt(args[2]);

console.log("=======================================\n" +
  "  __  __                      _        \n" +
  " |  \\/  |                    (_)       \n" +
  " | \\  / |  __ _  _ __ __   __ _  _ __  \n" +
  " | |\\/| | / _` || '__|\\ \\ / /| || '_ \\ \n" +
  " | |  | || (_| || |    \\ V / | || | | |\n" +
  " |_|  |_| \\__,_||_|     \\_/  |_||_| |_|\n" +
  "=======================================");
console.log(`[MARVIN] Generating ${chars} characters from the model ${path}`);

fs.readFile("./charlist.json", "utf-8", (error, data) => {
  charlist = JSON.parse(data);

  n = new marvin.network(path, () => {
    console.log(`[MARVIN] COMBINED:\n   "${generate(inputText, n)}"`);
  });
});

function generate(input, network) {
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

function letterToIndex(letter) {
  return charlist.findIndex((element) => {
    return element == letter;
  });
}

function indexToLetter(index) {
  return charlist[index];
}

module.exports.generate = generate;
