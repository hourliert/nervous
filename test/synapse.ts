/// <reference path="../lib//all.d.ts" />

import chai = require('chai');

import {Synapse} from '../lib/synapse';

let expect = chai.expect;


describe('Synapse', () => {
  let s,
      n1,
      n2,
      weight = 1;
  
  beforeEach(() => {
    n1 = {
      id: 1
    };
    n2 = {
      id: 2
    };
    s = new Synapse(n1, n2, weight);
  });
  
  it ('should be defined', () => {
    expect(s).to.be.ok;
    expect(s.id).to.equal(`s_1_2`);
    expect(s.weight).to.equal(1);
    expect(s.gradient).to.equal(0);
  });
  
  it ('should set weight', () => {
    s.weight = 4;
    expect(s.weight).to.equal(4);
  });
  
  it ('should get weight', () => {
    expect(s.weight).to.equal(weight);
  });
  
  it ('should get neurons', () => {
    let neurons = s.neurons;
    
    expect(neurons.input).to.deep.equal(n1);
    expect(neurons.output).to.deep.equal(n2);
  })
  
  it ('should set neurons', () => {
    let n3 = {
        id: 3
      },
      n4 = {
        id: 4
      };
    
    s.neurons = {
      input: n3,
      output: n4
    };
    
    let neurons = s.neurons;
    expect(neurons.input).to.deep.equal(n3);
    expect(neurons.output).to.deep.equal(n4);
  });
  
  it ('should set gradient', () => {
    s.gradient = 4;
    expect(s.gradient).to.equal(4);
  });
  
  it ('should get gradient', () => {
    expect(s.gradient).to.equal(0);
  });
});