![Marvin.js](https://raw.githubusercontent.com/MikeKuijper/marvinjs/master/logos/logo.png)
=======

![Marvin gif from A Hitchhiker's Guide To The Galaxy](https://media.giphy.com/media/ibI6pMtGf5tnO/giphy.gif)

# What exactly is Marvin.js?
Marvin.js is a fully open-source JavaScript neural network library. You can use it to create neural network implementations with ease!

# What is a neural network?
A neural network aims to achieve Artificial Intelligence (AI) by creating a network of _neurons_. Now, what does that mean? Basically, a neural network is an imaginary network of layers of _neurons_, nothing more than an object whose output is dependent on the neurons in the previous layer. Once it knows its output, it moves on to the next layer and repeats the process. This way, we can create incredibly complicated mathematical functions than can, for example, identify hand written digits with a high accuracy.
## Note:
1. The first layer is called the input layer. The last is called the output layer.
2. The input layer is set to the input at the start of the feed.
3. The output layer is (surprise, surprise) the layer that gets outputted.
4. Training a network means adjusting the function in order to make the output more like the desired.
5. The cost of network is a value to reflect how wrong a network is _on average_.

Documentation
======

## Classes
| Class | Function |
| ------- | ------- |
| network | Create a new neural network with a set amount of layers and neurons |
| neuron | It's used by the code of the network, I can't really find a reason to use it. |

## Example init calls
### network
```javascript
  let network = new marvin.network([10, 4, 4, 2], 1);
  // This creates a network consisting of 4 layers
  // Layer 1: (The input layer)         has 10 neurons
  // Layer 2: (The first hidden layer)  has 4 neurons
  // Layer 3: (The last hidden layer)   has 4 neurons
  // Layer 4: (The output layer)        has 2 neurons
  // The learning rate is 1
```
### neuron
```javascript
  let neuron = new marvin.neuron(2, 3);
  // This creates a new neuron, keep in mind that it's not added to a network
```

## network Methods
| Method | What it does |
| ------- | ------- |
| network.log() | Logs the neural network; Useful for debugging |
| network.getNeuron(layerNumber, neuronNumber) | Returns the neuron object at neuronNumber in layerNumber |
| network.getLayer(layerNumber) | Returns an array of neurons from the specified layer |
| network.forAllLayers(function, [backwardsBoolean]) | Executes a function for every layer. Goes back-to-front if backwardsBoolean is true |
| network.forAllNeurons(function, [backwardsBoolean]) | Executes a function for every neuron. Goes back-to-front if backwardsBoolean is true |
| network.forAllNeuronsInLayer(function, layerNumber) | Executes a function for neuron in the specified layer. |
| network.getWeight(neuron1, neuron2) | Gets the weight value for the connection between the neurons |
| network.setWeight(neuron1, neuron2, number) | Sets the weight value of the connection between the neurons |
| network.train(input, expectedOutput) | Trains the network. The input is an array of the first layer. The expectedOutput is an array of the expected last layer. Returns the cost |
| network.feed(input) | Feeds the input into the neural network and returns the last layer |
| network.normalize(number) | Normalizes the input using the activation function specified in network.activationFunction |
| network.deriveNormalize(number) | Reverts the input back to a normal number using the activation function specified in network.activationFunction |
| network.save(path) | Save the network to a file so that you can use it again later |
| network.load(path, [callbackFunction]) | Load a network from a file. (Optional): Supply a callback function that gets run after the loading process is done |

## neuron Methods
| Method | What it does |
| ----- | -------- |
| neuron.setWeight(input) | Sets the weights of the neuron equal to the input. Input must be an array of the length of the previous layer  |
| neuron.setWeight(input, input2) | Sets the weight for previous neuron with the neuronNumber 'input' equal to input2 |
| neuron.addWeight() | Adds a weight to the neuron |
| neuron.setBias() | Sets the bias of the neuron |
| neuron.log() | Logs the variables of the neuron; Useful for debugging |

# An example
The goal of this example neural network is to copy the input layer.
So, [1, 0, 0] in should mean [1, 0, 0] out.
```JavaScript

const marvin = require("./marvin_node.js");

let iterations = 1000;

// Example init call
let n = new marvin.network([3, 4, 4, 3], 1);

console.clear();
console.log(`<<< TRAINING ${iterations} TIMES >>>\n`);

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
}

console.log();
console.log("<<< FINISHED TRAINING >>>")
console.log("===================");
console.log(`IN: [1, 0, 0]; EXPECTED OUT: [1, 0, 0]; OUT: [${n.feed([1, 0, 0])}]`);
console.log(`IN: [0, 1, 0]; EXPECTED OUT: [0, 1, 0]; OUT: [${n.feed([0, 1, 0])}]`);
console.log(`IN: [0, 0, 1]; EXPECTED OUT: [0, 0, 1]; OUT: [${n.feed([0, 0, 1])}]`);
console.log("===================");

```
