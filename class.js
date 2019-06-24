//Todo:
//Add expectedOutputCell and expectedOutput to network.train
//Proportional to weight
//This.forallneurons
//fix line 97 if (j != this.network.length - 1) {
//fix input layer having bias
//fix backprop for more than 2 layers

//let config = require("./config.json");
//let math = require("mathjs");

class neuron {
  constructor(layernr, neuronnr) {
    this.layer = parseInt(layernr);
    this.neuron = parseInt(neuronnr);
    this.weight = [];
    this.bias = [];
    this.activation = 0;
    //this.previousActivation = null;
  }

  setWeight(input, input2) {
    if (!input2) this.weight = input;
    else this.weight[input] = input2;
  }

  setBias(input) {
    this.bias = input;
  }

  addWeight(input) {
    this.weight.push(input);
  }

  log() {
    console.log(this);
    //console.log(`neuron [${this.layer}, ${this.neuron}]:`);
    //console.log(`   weight: ${this.weight}`);
    //console.log(`   bias:   ${this.bias}`);
  }
}

class network {
  constructor(structure, lr) {
    // Error handling
    let error = false;
    if (structure.length < 2) {
      console.error("The input array should consist of at least 2 entries");
      error = true;
    }
    if (!Array.isArray(structure)) {
      console.error("Please check if the input is an array");
      error = true;
    }
    if (error) process.exit();

    if (lr) this.learningRate = lr;
    else this.learningRate = 1;

    // Create network and store in 'this.network'
    this.network = [];
    for (let i in structure) {
      i = parseInt(i);
      let _amount = structure[i];
      let _layer = [];
      for (let j = 0; j < _amount; j++) {
        let _n = new neuron(i, j);
        for (let k in this.network[i - 1]) {
          _n.addWeight(Math.random() * 2 - 1);
        }
        _n.bias = (Math.random() * 2 - 1);
        _layer.push(_n);
      }
      this.network.push(_layer);
    }
  }

  log() {
    //execute log function for every neuron
    for (let layernr in this.network) {
      for (let neuronnr in this.network[layernr]) {
        let n = this.network[layernr][neuronnr];
        n.log();
      }
    }
  }

  getNeuron(layernr, neuronnr) {
    let error = false;
    if (layernr >= this.network.length) {
      console.error(`Layer ${layernr} doesn't exist`);
      error = true;
    }
    if (!error && layernr < 0) layernr = this.network.length + layernr;
    if (!error && neuronnr >= this.network[layernr].length || !error && neuronnr < 0) console.error("That neuron doesn't exist");

    if (error) process.exit();
    return this.network[layernr][neuronnr];
  }

  getLayer(layernr) {
    if (layernr > this.network.length - 1) console.error("That layer doesn't exist");
    if (layernr < 0) layernr = this.network.length + layernr;
    if (layernr < -this.network.length);
    return this.network[layernr];
  }

  forAllLayers(f, backwards) {
    if (!backwards) {
      for (let i in this.network) {
        f(i);
      }
    } else {
      for (let i in this.network) {
        f(this.network.length - 1 - i);
      }
    }
  }

  forAllNeurons(f, backwards) {
    if (!backwards) {
      for (let i in this.network) {
        for (let j in this.network[i]) {
          f(i, j);
        }
      }
    } else {
      for (let i in this.network) {
        for (let j in this.network[i]) {
          f(parseInt(this.network.length - 1 - i), parseInt(j));
        }
      }
    }
  }

  forAllNeuronsInLayer(f, layernr) {
    if (layernr > this.network.length - 1) console.error("That layer doesn't exist");
    if (layernr < 0) layernr = this.network.length + layernr;
    for (let i in this.network[layernr]) {
      if (this.network[layernr]) f(layernr, i);
    }
  }

  getWeight(n, n2) {
    if (n2.layer - n.layer != 1) console.error("These neurons don't have a connection");
    return this.network[n2.layer][n2.neuron].weight[n.neuron];
  }

  setWeight(n, n2, num) {
    if (n2.layer - n.layer != 1) console.error("These neurons don't have a connection");
    this.network[n2.layer][n2.neuron].weight[n.neuron] = num;
  }


  train(input, expectedOutput) {
    if (!expectedOutput) expectedOutput = 1;
    // get cost
    let res = this.feed(input);

    let cost = 0;
    // for (let i in res) {
    //   if (i == expectedOutputNeuron) {
    //     cost += Math.pow((res[i] - 1), 2);
    //   } else {
    //     cost += Math.pow(res[i], 2);
    //   }
    // }

    //let cost;
    this.forAllNeuronsInLayer((layernr, neuronnr) => {
      let n = this.getNeuron(layernr, neuronnr);
      let grad = deriveNormalize(n.activation);
      let error = expectedOutput[neuronnr] - n.activation;
      n.error = grad * error;
      n.bias += this.learningRate * n.error;
      cost += Math.abs(n.error);
    }, -1);
    this.cost = cost;

    this.forAllNeurons((layernr, neuronnr) => {
      let currentNeuron = this.getNeuron(layernr, neuronnr);
      if (layernr + 1 <= this.network.length) {
        let nextLayer = this.getLayer(layernr + 1);

        let sum = 0;
        for (let index in nextLayer) {
          sum += this.getWeight(nextLayer[index], currentNeuron) * nextLayer[index].error;
        }

        currentNeuron.error = sum * deriveNormalize(currentNeuron.activation);
        currentNeuron.bias += this.learningRate * currentNeuron.error;

        for (let index in nextLayer) {
          let w = this.getWeight(nextLayer[index], currentNeuron) + this.learningRate * nextLayer[index].error * currentNeuron.activation;
          // nextLayer[index].weight[currentNeuron.neuron] = w;
          this.setWeight(nextLayer[index], currentNeuron, w);
        }
      }
    }, false);

    // this.forAllNeurons((layernr, neuronnr) => {
    //   let currentNeuron = this.getNeuron(layernr, neuronnr);
    //   if (layernr - 1 >= 0) {
    //     let nextLayer = this.getLayer(layernr - 1);
    //
    //   }
    // }, true);

    // for (let j in this.network[layernr - 1]) {
    //   let previousNeuron = this.network[layernr - 1][j];
    //   let isCorrect = (neuronnr == expectedOutputNeuron && layernr + 1 == this.network.length) || (layernr + 1 != this.network.length && currentNeuron.weight[j] > 0);
    //   let error, delta, target;
    //   for (let k in currentNeuron.weight) {
    //     //console.log(`[${layernr}, ${neuronnr}] => [${layernr -1}, ${j}]:   ${isCorrect}`);
    //     if (isCorrect) {
    //       if (layernr + 1 == this.network.length) target = expectedOutput;
    //       else target = 1;
    //       error = (target - previousNeuron.activation);
    //       // For example: 1 - 0.8 = 0.2, so it should increase by 0.2
    //     } else {
    //       target = 0;
    //       error = (target - previousNeuron.activation);
    //       // For example: 0 - 0.4 = -0.4, so it should decrease by 0.4
    //     }
    //     delta = error * deriveNormalize(currentNeuron.previousActivation);
    //     //let delta = error * deriveNormalize(previousNeuron.activation) * config.learningRate;
    //     //let outputToUse;
    //     //if (layernr == this.network.length - 1) outputToUse = input[neuronnr];
    //     //else outputToUse = previousNeuron.previousActivation;
    //     currentNeuron.weight[k] += delta * previousNeuron.previousActivation * config.learningRate;
    //console.log(delta);
    // }
    // }
    // }, true);

    // Average desired changes
    // let averaged = [];
    // for (let m in delta[0]) {
    //   let layer = [];
    //   for (let n in delta[m]) {
    //     let r;
    //     let freq = 0;
    //     let total = 0;
    //     for (let o in delta[0]) {
    //       freq++;
    //       if (delta[m][o][n]) total += delta[m][o][n];
    //     }
    //     if (freq != 0) {
    //       r = total / freq;
    //       layer.push(r);
    //     }
    //   }
    //   averaged.push(layer);
    // }
    //
    // // Apply desired changes
    // for (let p in this.network) {
    //   for (let q in this.network[this.network.length - p - 1]) {
    //     let current = this.network[this.network.length - p - 1][q];
    //     for (let s in current.weight) {
    //       let val = averaged[p][q] * config.learningRate;
    //       current.weight[s] += val;
    //     }
    // }
    // }

    return cost;
  }

  feed(input) {
    // Error handling
    let error = false;
    if (!error && !input) {
      console.error("Please provide the input");
      error = true;
    }
    if (!error && input.length != this.network[0].length) {
      console.error(`The input array must be of the same length as the input layer, it is now ${input.length}, but it should be ${this.network[0].length}`);
      error = true;
    }
    if (!error && !Array.isArray(input)) {
      console.error("Please check if the input is an array");
      error = true;
    }
    if (error) process.exit();

    //Set input layer
    for (let i in this.getLayer(0)) {
      let current = this.getLayer(0)[i];
      current.activation = input[i];
    }

    this.forAllNeurons((layernr, neuronnr) => {
      if (layernr != 0) {
        let current = this.getNeuron(layernr, neuronnr);

        let total = 0;
        for (let l in current.weight) {
          total += current.weight[l] * this.getLayer(layernr - 1)[l].activation;
        }
        total += parseFloat(current.bias);
        //current.previousActivation = current.activation;
        current.activation = normalize(total);
      }
    });

    // Format output
    let res = [];
    this.forAllNeuronsInLayer((layernr, neuronnr) => {
      res.push(parseFloat(this.getLayer(-1)[neuronnr].activation));
    }, -1)
    return res;
  }
}

function normalize(input) {
  return 1 / (1 + Math.pow(Math.E, -input));
}

function deriveNormalize(input) {
  return input * (1 - input);
}

// Export classes
module.exports.neuron = neuron;
module.exports.network = network;
module.exports.normalize = normalize;
