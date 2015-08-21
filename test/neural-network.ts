/// <reference path="../lib//all.d.ts" />

import chai = require('chai');

import {NeuralNetwork} from '../lib/neural-network';

let expect = chai.expect;

describe('Neural Network', () => {
  let nn,
      config;
  
  beforeEach (() => {
    config = {
      inputLayerSize: 2,
      hiddenLayers: [3],
      outputLayerSize: 1,
      trainingOptions: {
        regularization: 0.0001,
        iterations: 1000000,
        learningRate: 1,
        log: true
      }
    };
    nn = new NeuralNetwork(config);
  });
  
  it ('should be defined', () => {
    expect(nn).to.be.ok;
  });
  
  
});