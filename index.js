const marvin = require("./marvin.js");
const progress = require('cli-progress');

let iterations = 50000;

const bar = new progress.Bar({barsize: 150}, progress.Presets.shades_classic);

// Example init call
let n = new marvin.network([3, 4, 4, 3], 1);

console.clear();
console.log(`<<< TRAINING ${iterations} TIMES >>>\n`);

// Initializing the progress bar
bar.start(iterations, 0);

// Training the network with both hardcoded and generated data
for (let i = 1; i <= iterations; i++) {
  n.train([1, 0, 0], [1, 0, 0]);
  n.train([0, 1, 0], [0, 1, 0]);
  n.train([0, 0, 1], [0, 0, 1]);
  let r1 = Math.random();
  n.train([r1, 0, 0], [r1, 0, 0]);
  let r2 = Math.random();
  n.train([0, r2, 0], [0, r2, 0]);
  let r3 = Math.random();
  n.train([0, 0, r3], [0, 0, r3]);

  // Updating the progress bar
  bar.update(i);
}
bar.stop();

console.log();
console.log("<<< FINISHED TRAINING >>>")
console.log("===================");
let p1 = n.feed([1, 0, 0]);
console.log(`IN: [1, 0, 0]; EXPECTED OUT: [1, 0, 0]; OUT: [${p1}]`);
// console.log(`ERROR: [${Math.abs(1 - p1[0])}, ${Math.abs(0 - p1[1])}, ${Math.abs(0 - p1[2])}]`)
let p2 = n.feed([0, 1, 0]);
console.log(`IN: [0, 1, 0]; EXPECTED OUT: [0, 1, 0]; OUT: [${n.feed([0, 1, 0])}]`);
// console.log(`ERROR: [${Math.abs(0 - p2[0])}, ${Math.abs(1 - p2[1])}, ${Math.abs(0 - p2[2])}]`)
let p3 = n.feed([0, 0, 1]);
console.log(`IN: [0, 0, 1]; EXPECTED OUT: [0, 0, 1]; OUT: [${n.feed([0, 0, 1])}]`);
// console.log(`ERROR: [${Math.abs(0 - p3[0])}, ${Math.abs(0 - p3[1])}, ${Math.abs(1 - p3[2])}]`)
console.log("===================");
n.save();
