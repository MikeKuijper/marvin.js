Contributing to marvin.js
=====

**Thank you for contributing! It really helps a lot!**

# Requirements
## #1: Basic knowledge of neural networks
Primarily, you're required to have at least a basic understanding of how neural networks work. This is very important! There are plenty learning resources on the internet and I've made my own list of useful links, it's at the bottom of this file.

## #2: Contribute readable code
### #2.a: Avoid abbreviations in your code
Always avoid abbreviations, even though you know and understand them now, that will change when you haven't looked at your code for a few months. Moreover, it can be really hard for other people to understand them when reading through your code.
### #2.b: Use comments
Comments are a great way to describe to some random reader what the code is doing. **USE THEM**!!! It also helps you, since you have to think about how your would describe what you're doing. This can help you understand it better yourself and, quite importantly, help you write better code.
### #2.c: Remove Comments
I know how useful it is to just quickly comment a line of code out to prevent it from running. I encourage you to do it, since it can help save some time (pro-tip: CTRL+/ comments a line out automatically!), but please remove them before making a pull request. The lines don't get executed and it makes the code look messy.
### #2.d: Use the newer syntaxes
In the past years, a lot of new syntaxes were added to JavaScript. You don't have to use them all, but if it makes your code more readable, then do it!

**Example:**

#### _Old Syntax_
```JavaScript
  let array = ['a', 'b', 'c'];

  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
```

#### _New Syntax_
```JavaScript
  let array = ['a', 'b', 'c'];

  for (let i in array) {
    console.log(array[i]);
  }
```


# Learning resources
1. [3Blue1Brown's Neural Network video series](https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) - Explains how neural networks work
2. [Franpapers' article](https://franpapers.com/en/machine-learning-ai-en/2017-neural-network-implementation-in-javascript-by-an-example/) - Explains how to implement neural networks in JavaScript
3. [Hackernoon's article](https://hackernoon.com/neural-networks-from-scratch-for-javascript-linguists-part1-the-perceptron-632a4d1fbad2) - Explains the details of a neural network
4. The internet - Do some research!
