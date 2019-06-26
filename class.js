//Todo:
//Add expectedOutputCell and expectedOutput to network.train
//Proportional to weight
//This.forallneurons
//fix line 97 if (j != this.network.length - 1) {
//fix input layer having bias
//fix backprop for more than 2 layers

//let config = require("./config.json");
//let math = require("mathjs");

const normalizingMethods = {
  SIGMOID: 1
};

class neuron {
  constructor(layernr, neuronnr) {
    this.layer = parseInt(layernr);
    this.neuron = parseInt(neuronnr);
    this.weight = [];
    this.bias = [];
    this.activation = 0;
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

    this.normalizingMethod = normalizingMethods.SIGMOID;

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
          f(parseInt(i), parseInt(j));
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
    let res = this.feed(input);
    this.globalError = 0;

    let cost = 0;
    this.forAllNeuronsInLayer((layernr, neuronnr) => {
      let n = this.getNeuron(layernr, neuronnr);
      let grad = this.deriveNormalize(n.activation);
      let error = expectedOutput[neuronnr] - n.activation;
      n.error = grad * error;
      cost += Math.abs(error);
      this.globalError += Math.abs(error);
      n.bias += this.learningRate * n.error;
    }, -1);
    //console.log(cost);
    this.cost = cost;

    this.forAllNeurons((layernr, neuronnr) => {
      let currentNeuron = this.getNeuron(layernr, neuronnr);
      if (layernr + 1 < this.network.length) {
        let nextLayer = this.getLayer(layernr + 1);

        let sum = 0;
        for (let index in nextLayer) {
          sum += this.getWeight(currentNeuron, nextLayer[index]) * nextLayer[index].error;
        }

        currentNeuron.error = sum * this.deriveNormalize(currentNeuron.activation);
        this.globalError += Math.abs(currentNeuron.error);
        currentNeuron.bias += this.learningRate * currentNeuron.error;

        for (let index in nextLayer) {
          let w = this.getWeight(currentNeuron, nextLayer[index]) + this.learningRate * nextLayer[index].error * this.deriveNormalize(currentNeuron.activation);
          // let w = this.getWeight(nextLayer[index], currentNeuron) + this.learningRate * nextLayer[index].error * currentNeuron.activation;
          // nextLayer[index].weight[currentNeuron.neuron] = w;
          this.setWeight(currentNeuron, nextLayer[index], w);
        }
      }
    }, false);

    return this.cost;
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
    switch (this.normalizingMethod) {
      case normalizingMethods.SIGMOID:
        return 1 / (1 + Math.pow(Math.E, -input));
        break;
      default:
        console.error("Invalid normalizing method");
        process.exit();
    }
  }

  deriveNormalize(input) {
    switch (this.normalizingMethod) {
      case normalizingMethods.SIGMOID:
        return input * (1 - input);
        break;
        default:
        console.error("Invalid normalizing method");
        process.exit();
    }
  }
}

// Export classes
module.exports.neuron = neuron;
module.exports.network = network;
