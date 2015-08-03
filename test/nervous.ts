/// <reference path="../typings/tsd.d.ts" />

import {Nervous, computeNumericalGradients} from '../lib/nervous';
import {PlainMatrix} from '../lib/utils/matrix';
import {norm, sub, add} from '../lib/utils/array';
import chai = require('chai');

var expect = chai.expect;

describe.skip('Nervous', function() {
  let nervous: Nervous;
  
  beforeEach(() => {
    nervous = new Nervous({
      inputLayerSize: 2,
      hiddenLayers: [3],
      outputLayerSize: 1,
      iterations: 100,
      regulation: 0.0001,
      learningRate: 0.5
    });
  });
  
  afterEach(() => {
    nervous = null;
  });
  
  it('should be defined', function() {
    expect(nervous).to.be.ok;
    expect(nervous.weights.length).to.be.equals(2);
    expect(nervous.weights[0].numRows).to.be.equals(2);
    expect(nervous.weights[0].numCols).to.be.equals(3);
    expect(nervous.weights[1].numRows).to.be.equals(3);
    expect(nervous.weights[1].numCols).to.be.equals(1);
  });

  it('should forward', function() {
    let input = new PlainMatrix([
        [3, 5]
      ]),
      output = nervous.forward(input);
  });

  it('should compute the cost.', function() {
    let input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      cost = nervous.cost(input, realOutput);
  });
  
  it('should compute the prime cost.', function() {
    let input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      cost = nervous.costPrime(input, realOutput);
      
      expect(cost).to.be.ok;
      expect(cost.length).to.be.equals(2);
      expect(cost[0].numRows).to.be.equals(2);
      expect(cost[0].numCols).to.be.equals(3);
      expect(cost[1].numRows).to.be.equals(3);
      expect(cost[1].numCols).to.be.equals(1);
  });
  
  it('should compute the number of gradients', function() {
    let numberOfGradients = nervous.numberOfGradients();
      
      expect(numberOfGradients).to.be.equals(2*3 + 3*1);
  });
  
  it('should compute the gradients', function() {
    let input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      gradients = nervous.computeGradients(input, realOutput);
      
      expect(gradients.length).to.be.equals(2*3 + 3*1);
  });
  
  it('should compute the numerical gradients', function() {
    let input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      numGradients = computeNumericalGradients(nervous, input, realOutput);
      
      expect(numGradients.length).to.be.equals(2*3 + 3*1);
  });
  
  it('should compare the gradients and the numerical gradients', function() {
    let input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      gradients = nervous.computeGradients(input, realOutput),
      numGradients = computeNumericalGradients(nervous, input, realOutput),
      normResult = norm(sub(gradients, numGradients)) / norm(add(gradients, numGradients));
      
      expect(gradients.length).to.be.equals(2*3 + 3*1);
      expect(numGradients.length).to.be.equals(2*3 + 3*1);
      expect(normResult).to.be.below(1e-8);
  }); 
  
  it('should adjust the weihgts', function() {
    let input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      dJdW = nervous.costPrime(input, realOutput),
      weights = nervous.adjustWeights(dJdW);
      
      expect(weights).to.be.ok;
      expect(weights[0].numRows).to.be.equals(2);
      expect(weights[0].numCols).to.be.equals(3);
      expect(weights[1].numRows).to.be.equals(3);
      expect(weights[1].numCols).to.be.equals(1);
  });
  
  it('should train the network for random value', function() {
    let input = new PlainMatrix([
        [3.0 / 10.0, 5.0 / 10.0], 
        [5.0 / 10.0, 1.0 / 10.0], 
        [10.0 / 10.0, 2.0 / 10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0 / 100.0], 
        [82.0 / 100.0], 
        [93.0 / 100.0]
      ]);
      
      nervous.train(input, realOutput);
  });
  
  it('should train the network for xor', function() {
    let input = new PlainMatrix([
        [0, 0], 
        [0, 1], 
        [1, 0],
        [1, 1]
      ]),
      realOutput = new PlainMatrix([
        [0],
        [1], 
        [1],
        [0]
      ]);
      
      nervous.train(input, realOutput);
  });
});
