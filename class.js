//Todo:
// Add support for different things than numbers (like text, audio, image/video, etc.)
// Fix 3, 4, 3, 3 error

const fs = require('fs');

const activationFunctions = {
  SIGMOID: 1,
  TANH: 2,
  RELU: 3
};

class neuron {
  constructor(layernr, neuronnr) {
    this.layer = parseInt(layernr);
    this.neuron = parseInt(neuronnr);
    this.weight = [];
    this.bias = [];
    this.activation = 0;
    this.lastActivation = 0;
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

    this.activationFunction = activationFunctions.SIGMOID;

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
        // _n.bias = 0;
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
    layernr = parseInt(layernr);
    neuronnr = parseInt(neuronnr);
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
    layernr = parseInt(layernr);
    if (layernr > this.network.length - 1) console.error("That layer doesn't exist");
    if (layernr < 0) layernr = this.network.length + layernr;
    if (layernr < -this.network.length);
    return this.network[layernr];
  }

  forAllLayers(f, backwards) {
    if (!backwards) {
      for (let i in this.network) {
        f(parseInt(i));
      }
    } else {
      for (let i in this.network) {
        f(parseInt(this.network.length - 1 - i));
      }
    }
  }

  forAllNeurons(f, backwards) {
    if (!backwards) {
      for (let i in this.network) {
        for (let j in this.network[i]) {
          f(parseInt(i), parseInt(j));
        }
      }
    } else {
      for (let i in this.network) {
        for (let j in this.network[this.network.length - 1 - i]) {
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
    let res = this.feed(input);
    this.globalError = 0;
    let cost = 0;

    this.forAllNeuronsInLayer((layernr, neuronnr) => {
      let n = this.getNeuron(layernr, neuronnr);
      let grad = this.deriveNormalize(n.activation);
      let error = expectedOutput[neuronnr] - n.activation;
      n.error = grad * error;
      cost += Math.abs(error);
      n.bias += this.learningRate * n.error;
    }, -1);
    this.cost = cost;

    this.forAllNeurons((layernr, neuronnr) => {
      let currentNeuron = this.getNeuron(layernr, neuronnr);
      if (layernr <= this.network.length - 2) {
        let nextLayer = this.getLayer(layernr + 1);

        let sum = 0;
        for (let i in nextLayer) {
          sum += this.getWeight(currentNeuron, nextLayer[i]) * nextLayer[i].error;
        }

        currentNeuron.error = sum * this.deriveNormalize(currentNeuron.activation);
        this.globalError += Math.abs(currentNeuron.error);
        currentNeuron.bias += this.learningRate * currentNeuron.error;

        for (let index in nextLayer) {
          let w = this.getWeight(currentNeuron, nextLayer[index]) + this.learningRate * nextLayer[index].error * currentNeuron.activation;
          this.setWeight(currentNeuron, nextLayer[index], w);
        }
      }
    }, true);

    return this.cost;
  }

  autoTrain(inputArray, expectedOutputArray) {
    if (expectedOutputArray) {
      for (let i in inputArray) {
        this.train(inputArray[i], expectedOutputArray[i]);
      }
    } else {
      for (let i in inputArray) {
        this.train(inputArray[i][0], inputArray[i][1]);
      }
    }
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
        current.lastActivation = current.activation;
        current.activation = this.normalize(total);
      }
    });

    // Format output
    let res = [];
    this.forAllNeuronsInLayer((layernr, neuronnr) => {
      res.push(parseFloat(this.getLayer(-1)[neuronnr].activation));
    }, -1)
    return res;
  }

  normalize(input) {
    switch (this.activationFunction) {
      case activationFunctions.SIGMOID:
        return 1 / (1 + Math.pow(Math.E, -input));
        break;
      case activationFunctions.TANH:
        return 2 / (1 + Math.pow(Math.E, -2 * input));
        break;
      case activationFunctions.RELU:
        Math.max(input, 0);
        break;
      default:
        console.error("Invalid normalizing method");
        process.exit();
    }
  }

  deriveNormalize(input) {
    switch (this.activationFunction) {
      case activationFunctions.SIGMOID:
        return input * (1 - input);
        break;
      case activationFunctions.TANH:
        return 1 - Math.pow((2 / (1 + Math.pow(Math.E, -2 * input))), 2);
        break;
      case activationFunctions.RELU:
        return input;
        break;
      default:
        console.error("Invalid normalizing method");
        process.exit();
    }
  }

  save(filename) {
    // Save the network to a file
  }
}

// Export classes
module.exports.neuron = neuron;
module.exports.network = network;
module.exports.activationFunctions = activationFunctions;
