const neuralnetwork = require("./class.js");

//Example init call

//let n = new neuralnetwork.network([6, 4, 4, 2]); // For a network consisting of 4 layers with 6, 4, 4 and 2 neurons each
let n = new neuralnetwork.network([6, 4, 4, 2]); // For a network consisting of 4 layers with 6, 4, 4 and 2 neurons each
n.feed([1, 1, 1, 1, 1, 1]);
n.log();
