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
});