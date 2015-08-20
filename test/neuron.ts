/// <reference path="../lib//all.d.ts" />

import chai = require('chai');

import {Neuron, BiasNeuron, HiddenNeuron, InputNeuron, OutputNeuron} from '../lib/neuron';

let expect = chai.expect;

describe('Neuron', () => {
  let n,
      bias,
      input,
      hidden,
      output,
      layer = {
        id: '0'
      },
      position = 0;
  
  beforeEach (() => {
    n = new Neuron(<any>layer, 0);
    bias = new BiasNeuron(<any>layer, 1);
    input = new InputNeuron(<any>layer, 2);
    hidden = new HiddenNeuron(<any>layer, 3);
    output = new OutputNeuron(<any>layer, 4);
  });
  
  it ('should be defined', () => {
    //all abstraction have no overrided method. so we only need to test the Neuron class.
    expect(n).to.be.ok;
    expect(n.id).to.equal(`n_${layer.id}_0`);
    expect(bias).to.be.ok;
    expect(bias.id).to.equal(`n_${layer.id}_1`);
    expect(input).to.be.ok;
    expect(input.id).to.equal(`n_${layer.id}_2`);
    expect(hidden).to.be.ok;
    expect(hidden.id).to.equal(`n_${layer.id}_3`);
    expect(output).to.be.ok;
    expect(output.id).to.equal(`n_${layer.id}_4`);
  });
  
  it ('should get the neuron activated value', () => {
    expect(n.A).to.be.equal(0);
  });
  
  it ('should set the neuron activated value', () => {
    n.A = 10;
    expect(n.A).to.be.equal(10);
  });
  
  it ('should get the neuron pre-activated value', () => {
    expect(n.Z).to.be.equal(0);
  });
  
  it ('should set the neuron pre-activated value', () => {
    n.Z = 10;
    expect(n.Z).to.be.equal(10);
  });
  
  it ('should get the error inducted by the neuron', () => {
    expect(n.delta).to.be.equal(undefined);
  });
  
  it ('should set the error inducted by the neuron', () => {
    n.delta = 10;
    expect(n.delta).to.be.equal(10);
  });
  
  it ('should add an input synapse to the neuron', () => {
    let s = {
      id: 1
    };
    
    n.addInputSynapse(s);
    expect(n.inputSynapses.length).to.be.equal(1);
    expect(n.inputSynapses[0]).to.deep.equal(s);
  });
  
  it ('should add an output synapse to the neuron', () => {
    let s = {
      id: 1
    };
    
    n.addOutputSynapse(s);
    expect(n.outputSynapses.length).to.be.equal(1);
    expect(n.outputSynapses[0]).to.deep.equal(s);
  });
  
  it ('should activate the neuron', () => {
    let activationFunctions = {
          activation: x => 2*x,
          activationPrime: x => 2
        },
        s = {
          id: 1,
          weight: 0.5,
          neurons: {
            input: {
              A: 1
            }
          }
        };
    
    n.activate(activationFunctions);
    expect(n.Z).to.be.equal(0);
    expect(n.A).to.be.equal(0);
    
    n.addInputSynapse(s);
    
    n.activate(activationFunctions);
    expect(n.Z).to.be.equal(0.5);
    expect(n.A).to.be.equal(1);
  });
  
  it ('should compute the neuron error', () => {
    let cost = {
          delta: (x, y) => (x + y)
        },
        s = {
          id: 1,
          weight: 0.5,
          neurons: {
            output: {
              delta: 0.5
            }
          }
        };
        
    n.computeError(cost);
    expect(n.delta).to.be.equal(0);
    
    n.addOutputSynapse(s);
    n.computeError(cost);
    expect(n.delta).to.be.equal(0.25);
  });
  
  it ('should back-propagate the neuron error to compute synapses gradients further', () => {
    let s = {
          id: 1,
          weight: 0.5,
          gradient: 0,
          neurons: {
            output: {
              delta: 0.5
            }
          }
        };
        
    n.A = 1;
    n.addOutputSynapse(s);
    n.backPropagate();
    
    expect(s.gradient).to.be.equal(0.5);
  });
  
});