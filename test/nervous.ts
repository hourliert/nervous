/// <reference path="../typings/tsd.d.ts" />

import {Nervous, computeNumericalGradients} from '../lib/nervous';
import {PlainMatrix} from '../lib/utils/matrix';
import {norm, sub, add} from '../lib/utils/array';
import chai = require('chai');

var expect = chai.expect;

describe('Nervous', function() {
  it('should be defined.', function() {
    let nervous = new Nervous(2, [3, 3], 1);

    expect(nervous).to.be.ok;
    expect(nervous.weights.length).to.be.equals(3);
    expect(nervous.weights[0].numRows).to.be.equals(2);
    expect(nervous.weights[0].numCols).to.be.equals(3);
    expect(nervous.weights[1].numRows).to.be.equals(3);
    expect(nervous.weights[1].numCols).to.be.equals(3);
    expect(nervous.weights[2].numRows).to.be.equals(3);
    expect(nervous.weights[2].numCols).to.be.equals(1);
  });

  it('should forward', function() {
    let nervous = new Nervous(2, [3, 3], 1),
      input = new PlainMatrix([
        [3, 5]
      ]),
      output = nervous.forward(input);
  });

  it('should compute the cost.', function() {
    let nervous = new Nervous(2, [3, 3], 1),
      input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      cost = nervous.cost(input, realOutput);
  });
  
  it('should compute the prime cost.', function() {
    let nervous = new Nervous(2, [3, 3], 1),
      input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      cost = nervous.costPrime(input, realOutput);
      
      expect(cost).to.be.ok;
      expect(cost[0].numRows).to.be.equals(2);
      expect(cost[0].numCols).to.be.equals(3);
      expect(cost[1].numRows).to.be.equals(3);
      expect(cost[1].numCols).to.be.equals(3);
      expect(cost[2].numRows).to.be.equals(3);
      expect(cost[2].numCols).to.be.equals(1);
  });
  
  it('should compute the number of gradients', function() {
    let nervous = new Nervous(2, [3, 3], 1),
      numberOfGradients = nervous.numberOfGradients();
      
      expect(numberOfGradients).to.be.equals(2*3 + 3*3 + 3*1);
  });
  
  it('should compute the gradients', function() {
    let nervous = new Nervous(2, [3, 3], 1),
      input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      gradients = nervous.computeGradients(input, realOutput);
      
      expect(gradients.length).to.be.equals(2*3 + 3*3 + 3*1);
  });
  
  it('should compute the numerical gradients', function() {
    let nervous = new Nervous(2, [3, 3], 1),
      input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      numGradients = computeNumericalGradients(nervous, input, realOutput);
      
      expect(numGradients.length).to.be.equals(2*3 + 3*3 + 3*1);
  });
  
  it('should compare the gradients and the numerical gradients', function() {
    let nervous = new Nervous(2, [3, 3], 1),
      input = new PlainMatrix([
        [3.0/10.0, 5.0/10.0]
      ]),
      realOutput = new PlainMatrix([
        [75.0/100.0]
      ]),
      gradients = nervous.computeGradients(input, realOutput),
      numGradients = computeNumericalGradients(nervous, input, realOutput),
      normResult = norm(sub(gradients, numGradients)) / norm(add(gradients, numGradients));
      
      expect(gradients.length).to.be.equals(2*3 + 3*3 + 3*1);
      expect(numGradients.length).to.be.equals(2*3 + 3*3 + 3*1);
      expect(normResult).to.be.below(1e-8);
  });
  
  
  it('should adjust the weihgts.', function() {
    let nervous = new Nervous(2, [3, 3], 1),
      input = new PlainMatrix([
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
      expect(weights[1].numCols).to.be.equals(3);
      expect(weights[2].numRows).to.be.equals(3);
      expect(weights[2].numCols).to.be.equals(1);
  });
});
