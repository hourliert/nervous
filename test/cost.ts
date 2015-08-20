/// <reference path="../lib//all.d.ts" />

import chai = require('chai');

let expect = chai.expect;

import {CostStrategy, CrossEntropyCost, QuadraticCost} from '../lib/cost';

describe('Cost Strategy', () => {
  let costStrategy, quadraticCost, crossEntropyCost,
       activationFunctions = {
        activation: x => 1,
        activationPrime: x => 2
      },
      data,
      yHat,
      A,
      Z;
  
  beforeEach(() => {
    costStrategy = new CostStrategy(activationFunctions);
    quadraticCost = new QuadraticCost(activationFunctions);
    crossEntropyCost = new CrossEntropyCost(activationFunctions);
    
    data = [0, 1];
    yHat = [0.1, 0.9];
    A = 0.5;
    Z = 0.1;
  });
  
  it ('should be defined', () => {
    expect(costStrategy).to.be.ok;
    expect(quadraticCost).to.be.ok;
    expect(crossEntropyCost).to.be.ok;
  });
  
  it ('should throw an expection if methods are not implemented', () => {
    expect(costStrategy.fn).to.throw();
    expect(costStrategy.delta).to.throw();
  });
  
  describe ('Quadratic Cost', () => {
    it ('should compute the cost', () => {
      expect(quadraticCost.fn(data, yHat)).to.be.equal(0.01);
    });
    
    it ('should compute the error', () => {
      expect(quadraticCost.delta(A, Z)).to.be.equal(1);
    });
  });
  
  describe ('Cross Entropy Cost', () => {
    it ('should compute the cost', () => {
      expect(crossEntropyCost.fn(data, yHat).toFixed(2)).to.be.equal('0.42');
    });
    
    it ('should compute the error', () => {
      expect(crossEntropyCost.delta(A, Z)).to.be.equal(0.5);
    });
  });
  
});