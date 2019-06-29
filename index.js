const marvin = require("./marvin_node.js");
// const progress = require('cli-progress');

let iterations = 100000;

// const bar = new progress.Bar({
//   barsize: 150
// }, progress.Presets.shades_classic);

// Example init call
// let n = new marvin.network([3, 4, 4, 3], 1);
// let n = new marvin.network('./data/network.mai', () => {
//   console.clear();
//
//   console.log("===================");
//   console.log(`IN: [1, 0, 0]; EXPECTED OUT: [1, 0, 0]; OUT: [${n.feed([1, 0, 0])}]`);
//   console.log(`IN: [0, 1, 0]; EXPECTED OUT: [0, 1, 0]; OUT: [${n.feed([0, 1, 0])}]`);
//   console.log(`IN: [0, 0, 1]; EXPECTED OUT: [0, 0, 1]; OUT: [${n.feed([0, 0, 1])}]`);
//   console.log("===================");
//
//   console.log(`\n<<< TRAINING ${iterations} TIMES >>>\n`);
//
//   // Initializing the progress bar
//   bar.start(iterations, 0);
//
//   // Training the network with both hardcoded and generated data
//   for (let i = 1; i <= iterations; i++) {
//     n.train([1, 0, 0], [1, 0, 0]);
//     n.train([0, 1, 0], [0, 1, 0]);
//     n.train([0, 0, 1], [0, 0, 1]);
//
//     let r1 = Math.random();
//     n.train([r1, 0, 0], [r1, 0, 0]);
//     let r2 = Math.random();
//     n.train([0, r2, 0], [0, r2, 0]);
//     let r3 = Math.random();
//     n.train([0, 0, r3], [0, 0, r3]);
//
//     // Updating the progress bar
//     bar.update(i);
//   }
//   bar.stop();
//
//   console.log("\n<<< FINISHED TRAINING >>>\n")
//   console.log("===================");
//   let p1 = n.feed([1, 0, 0]);
//   console.log(`IN: [1, 0, 0]; EXPECTED OUT: [1, 0, 0]; OUT: [${n.feed([1, 0, 0])}]`);
//   let p2 = n.feed([0, 1, 0]);
//   console.log(`IN: [0, 1, 0]; EXPECTED OUT: [0, 1, 0]; OUT: [${n.feed([0, 1, 0])}]`);
//   let p3 = n.feed([0, 0, 1]);
//   console.log(`IN: [0, 0, 1]; EXPECTED OUT: [0, 0, 1]; OUT: [${n.feed([0, 0, 1])}]`);
//   console.log("===================");
//
//   n.save("./data/network.mai", {forceOverwrite: false});
// });



console.clear();

let n = new marvin.network([3, 5, 5, 13]);
n.load('./data/colorDetection_5.mai', () => {

  // bar.start(iterations, 0);
  // for (let j = 1; j <= iterations; j++) {
  //   n.train([0.0, 0.0, 0.0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //Black
  //   n.train([0.0, 0.0, 1.0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //Blue
  //   n.train([0.2, 0.3, 0.8], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //Blue
  //   n.train([0.3, 0.2, 0.0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //Brown
  //   n.train([0.7, 0.5, 0.3], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //Brown
  //   n.train([0.4, 0.9, 1.0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //Cyan
  //   n.train([0.0, 1.0, 0.0], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]); //Green
  //   n.train([0.4, 0.7, 0.4], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]); //Green
  //   n.train([0.3, 0.3, 0.3], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]); //Grey
  //   n.train([0.6, 0.0, 0.8], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]); //Magenta
  //   n.train([1.0, 0.3, 0.7], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]); //Magenta
  //   n.train([1.0, 0.6, 0.1], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]); //Orange
  //   n.train([0.8, 0.7, 0.3], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]); //Orange
  //   n.train([1.0, 0.2, 0.9], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]); //Pink
  //   n.train([0.8, 0.3, 0.8], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]); //Pink
  //   n.train([0.8, 0.3, 0.0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]); //Purple
  //   n.train([0.4, 0.1, 0.7], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]); //Purple
  //   n.train([1.0, 0.0, 0.0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]); //Red
  //   n.train([0.8, 0.3, 0.3], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]); //Red
  //   n.train([1.0, 1.0, 1.0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]); //White
  //   n.train([0.9, 1.0, 0.0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]); //Yellow
  //   n.train([0.9, 0.9, 0.5], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]); //Yellow
  //
  //   // n.train([0.0 + Math.random() / 20, 0.0 + Math.random() / 20, 0.0 + Math.random() / 20], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  //   // n.train([0.0 + Math.random() / 20, 0.0 + Math.random() / 20, 1.0 + Math.random() / 20], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  //   // n.train([0.3 + Math.random() / 20, 0.2 + Math.random() / 20, 0.0 + Math.random() / 20], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  //   // n.train([0.4 + Math.random() / 20, 0.9 + Math.random() / 20, 1.0 + Math.random() / 20], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  //   // n.train([0.0 + Math.random() / 20, 1.0 + Math.random() / 20, 0.0 + Math.random() / 20], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
  //   // n.train([0.3 + Math.random() / 20, 0.3 + Math.random() / 20, 0.3 + Math.random() / 20], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
  //   // n.train([0.6 + Math.random() / 20, 0.0 + Math.random() / 20, 0.8 + Math.random() / 20], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]);
  //   // n.train([1.0 + Math.random() / 20, 0.6 + Math.random() / 20, 0.1 + Math.random() / 20], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
  //   // n.train([1.0 + Math.random() / 20, 0.2 + Math.random() / 20, 0.9 + Math.random() / 20], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
  //   // n.train([0.8 + Math.random() / 20, 0.3 + Math.random() / 20, 0.0 + Math.random() / 20], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
  //   // n.train([1.0 + Math.random() / 20, 0.0 + Math.random() / 20, 0.0 + Math.random() / 20], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
  //   // n.train([1.0 + Math.random() / 20, 1.0 + Math.random() / 20, 1.0 + Math.random() / 20], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
  //   // n.train([0.9 + Math.random() / 20, 1.0 + Math.random() / 20, 0.0 + Math.random() / 20], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
  //   // bar.update(j);
  // }
  // bar.stop();

  n.save('./data/colorDetection_6.mai', {
    forceOverwrite: false
  });
});
