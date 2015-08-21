/// <reference path="../lib//all.d.ts" />

import chai = require('chai');

import {NeuralNetwork, computeNumericalGradients} from '../lib/neural-network';
import {rootMeanSquare, sub, add} from 'nervous-array';

let expect = chai.expect;

describe('Neural Network', () => {
  let nn,
      config,
      data;
  
  beforeEach (() => {
    data = [
      {
        input: [3.0 / 10.0, 5.0 / 10.0],
        output: [75.0 / 100.0]
      },
      {
        input: [5.0 / 10.0, 1.0 / 10.0],
        output: [82.0 / 100.0]
      },
      {
        input: [10.0 / 10.0, 2.0 / 10.0],
        output: [93.0 / 100.0]
      },
      {
        input: [6.0 / 10.0, 3.0 / 10.0],
        output: [81.0 / 100.0]
      }
    ];
    config = {
      inputLayerSize: 2,
      hiddenLayers: [3],
      outputLayerSize: 1,
      trainingOptions: {
        regularization: 0,
        iterations: 1000,
        learningRate: 1,
        log: false
      },
      costStrategy: 0
    };
    nn = new NeuralNetwork(config);
  });
  
  it ('should be defined', () => {
    expect(nn).to.be.ok;
  });
  
  it ('should get network weights', () => {
    //3*4 + 4*1 because of biases
    expect(nn.weights.length).to.be.equal(16);
  });
  
  it ('should set network weights', () => {
    let weights = [];
    
    // with biases
    for (let i = 0; i < 16; i++) {
      weights.push(i);
    }
    
    nn.weights = weights;
    expect(nn.weights).to.deep.equal(weights);
  });
  
  it ('should get the network gradients', () => {
    expect(nn.getGradients(data).length).to.be.equal(16);
  });
  
  it ('should apply a function on each synapse', () => {
    //TODO need spies function
    let func = x => 2*x;
    nn.forEachSynapse(func);
  });
  
  it ('should forward the data through the network', () => {
    let res = nn.forward(data);
    expect(res.length).to.be.equal(4);
    expect(res[0].length).to.be.equal(1);
    expect(res[1].length).to.be.equal(1);
    expect(res[2].length).to.be.equal(1);
    expect(res[3].length).to.be.equal(1);
  });
  
  it ('should compute the cost to the origin data', () => {
    expect(nn.cost(data)).to.be.a('number');
  });
  
  it ('should backpropagate some data in the network', () => {
    let res = nn.backward(data);
    
    expect(res.length).to.be.equal(2);
    expect(res[0].length).to.be.equal(12);
    expect(res[1].length).to.be.equal(4);
  });
  
  it ('should adjust the network weights', () => {
    let synapses = [[], []];
    
    for (let i = 0 ; i < 16; i++) {
      let index = (i < 12) ? 0 : 1;
      synapses[index].push(i);
    }
    
    nn.adjustWeights(synapses, 1, 1);
  });
  
  it ('should train the network', () => {
    let res = nn.train(data);
    
    expect(res.error).to.be.a('number');
  });
  
  it ('should verify that gradients are well computed', () => {
    let gradients = nn.getGradients(data),
        numGradients = computeNumericalGradients(nn, data);

    //biases neurons regulation
    numGradients.forEach((x, i) => {
      if (x === 0) {
        numGradients[i] = gradients[i];
      }
    });
    
    let normResult = rootMeanSquare(sub(gradients, numGradients)) / rootMeanSquare(add(gradients, numGradients));
    expect(normResult).to.be.a('number');
    expect(normResult).to.be.below(1e-8);

  });
  
});