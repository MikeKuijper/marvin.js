const marvin = require("./class.js");


// Example init call
// let n = new neuralnetwork.network([6, 4, 4, 2]); // For a network consisting of 4 layers with 6, 4, 4 and 2 neurons each
let n = new marvin.network([3, 3], 0.2);

// console.log(n.feed([1, 0, 0]));
// n.log();
for (let i = 0; i < 1000000; i++) {
  // console.log(n.train([1, 0, 0], [1, 0, 0]));
  // console.log(n.train([0, 1, 0], [0, 1, 0]));
  // console.log(n.train([0, 0, 1], [0, 0, 1]));
  // let r1 = Math.random();
  // console.log(n.train([r1, 0, 0], [r1, 0, 0]));
  // let r2 = Math.random();
  // console.log(n.train([0, r2, 0], [0, r2, 0]));
  // let r3 = Math.random();
  // console.log(n.train([0, 0, r3], [0, 0, r3]));
  n.train([1, 0, 0], [1, 0, 0]);
  n.train([0, 1, 0], [0, 1, 0]);
  n.train([0, 0, 1], [0, 0, 1]);
  // let r1 = Math.random();
  // n.train([r1, 0, 0], [r1, 0, 0]);
  // let r2 = Math.random();
  // n.train([0, r2, 0], [0, r2, 0]);
  // let r3 = Math.random();
  // n.train([0, 0, r3], [0, 0, r3]);
}
// console.log("===================");
// n.log();
console.log("===================");
console.log(`IN: [1, 0, 0]; EXPECTED OUT: [1, 0, 0]; OUT: [${n.feed([1, 0, 0])}]`);
console.log(`IN: [0, 1, 0]; EXPECTED OUT: [0, 1, 0]; OUT: [${n.feed([0, 1, 0])}]`);
console.log(`IN: [0, 0, 1]; EXPECTED OUT: [0, 0, 1]; OUT: [${n.feed([0, 0, 1])}]`);

// n.forAllNeuronsInLayer((layernr, neuronnr) => {
//   let current = n.getNeuron(layernr, neuronnr);
//   let next = n.getNeuron(layernr + 1, neuronnr);
//   console.log(n.getWeight(current, next));
// },-1);
