class neuron {
  constructor(layernr, neuronnr) {
    this.layer = parseInt(layernr);
    this.neuron = parseInt(neuronnr);
    this.weight = [];
    this.bias = [];
  }

  setWeight(input, input2) {
    if (!input2) this.weight = input;
    else this.weight[input] = input2;
  }

  setBias(input, input2) {
    if (!input2) this.bias = input;
    else this.bias[input] = input2;
  }

  addWeight(input) {
    this.weight.push(input);
  }

  addBias(input) {
    this.bias.push(input);
  }

  log() {
    console.log(this);
  }
}

class network {
  constructor(structure) {
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

    this.neurons = [];
    for (let i in structure) {
      i = parseInt(i);
      let _amount = structure[i];
      let _layer = [];
      for (let j = 0; j < _amount; j++) {
        let _n = new neuron(i, j);
        for (let k in this.neurons[i - 1]) {
          _n.addWeight(1);
          _n.addBias(0);
        }
        _layer.push(_n);
      }
      this.neurons.push(_layer);
    }
  }

  log() {
    for (let layernr in this.neurons) {
      for (let neuronnr in this.neurons[layernr]) {
          let n = this.neurons[layernr][neuronnr];
          console.log(n);
          n.log();
      }
    }
  }

  train() {

  }

  feed(input) {
    let error = false;
    if (!error && !input) {
      console.error("Please provide the input");
      error = true;
    }
    if (!error && input.length != this.neurons[0].length) {
      console.error(`The input array must be of the same length as the input layer, it is now ${input.length}, but it should be ${this.neurons[0].length}`);
      error = true;
    }
    if (!error && !Array.isArray(input)) {
      console.error("Please check if the input is an array");
      error = true;
    }
    if (error) process.exit();

    let result = [];
    // for (let i in this.neurons[this.neurons.length - 1]) {
    //   let layer = this.neurons.length - 1;
    //   let neuron = i;
    //
    // }
    for (let i in this.neurons[0]) {
      let current = this.neurons[0][i];
      current = input[i];
    }
  }
}

function normalize(input) {
  return 1 / (1 + Math.pow(Math.E, -input));
}

module.exports.neuron = neuron;
module.exports.network = network;
