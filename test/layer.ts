/// <reference path="../lib//all.d.ts" />

import chai = require('chai');

let expect = chai.expect;

import {Layer, OutputLayer, HiddenLayer, InputLayer} from '../lib/layer';


describe('Layer', () => {
  let l,
      input,
      hidden,
      output,
      size = 10;
  
  beforeEach (() => {
    l = new Layer(size);
    input = new InputLayer(size);
    hidden = new HiddenLayer(size);
    output = new OutputLayer(size);
  });
  
  it ('should be defined', () => {
    expect(l).to.be.ok;
    expect(l.id).to.equal(`l_0`);
    expect(input).to.be.ok;
    expect(input.id).to.equal(`l_1`);
    expect(hidden).to.be.ok;
    expect(hidden.id).to.equal(`l_2`);
    expect(output).to.be.ok;
    expect(output.id).to.equal(`l_3`);
  });
  
  describe ('Layer abstraction', () => {
    //we testing with the output layer as its implementation 
    //is the same that the abstract layer
    
    it ('should get the neurons value', () => {
      for (let i = 0; i < output.neuronsValue.length; i++) {
        let element = output.neuronsValue[i];
        expect(element.id).to.equal(undefined);
      }
    });
    
    it ('should set the neurons value', () => {
      output.neuronsValue = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9
      ];
      
      for (let i = 0; i < output.neuronsValue.length; i++) {
        let element = output.neuronsValue[i];
        expect(element).to.equal(i);
      }
    });
    
    it ('should get the correct number of neurons', () => {
      expect(output.neuronsValue.length).to.equal(size);
    });
    
    it ('should link 2 layers', () => {
      let s = output.linkTo(output);
      expect(s.length).to.be.equal(100);
    });
    
    it ('should apply a function on each neurons', () => {
      // TODO need spies to test this methods
      let f = x => 1;
      output.forEachNeuron(f);
    });
    
    it ('should activate on each neurons', () => {
      // TODO need spies to test this methods or mocks
      let activations = {
          activation: x => 1,
          activationPrime: x => 2
        };
      output.activate(activations);
    });
    
    it ('should compute error of each neurons', () => {
      // TODO need spies to test this methods or mocks
      let cost = {
          delta: x => 1
        };
      output.computeErrors(cost);
    });
    
    it ('should compute gradient of each neurons', () => {
      // TODO need spies to test this methods or mocks
      output.computeGradients();
    });
    
  });
  
  describe ('Input Layer', () => {
    
    it ('should be correctly instantiated', () => {
      expect(input).to.be.instanceOf(Layer);
      expect(input).to.be.instanceOf(InputLayer);
    });
    
    it ('should get the correct number of neurons', () => {
      expect(input.neuronsValue.length).to.equal(size + 1);
    });
    
    it ('should not be activable', () => {
      expect(input.activate).to.throw();
    });
    
  });
  
  describe ('Hidden Layer', () => {
    
    it ('should be correctly instantiated', () => {
      expect(hidden).to.be.instanceOf(Layer);
      expect(hidden).to.be.instanceOf(HiddenLayer);
    });
    
    it ('should get the correct number of neurons', () => {
      expect(hidden.neuronsValue.length).to.equal(size + 1);
    });
    
  });
  
  describe ('Output Layer', () => {
    
    it ('should be correctly instantiated', () => {
      expect(output).to.be.instanceOf(Layer);
      expect(output).to.be.instanceOf(OutputLayer);
    });
    
    it ('should get the correct number of neurons', () => {
      expect(output.neuronsValue.length).to.equal(size);
    });
    
  });
  
});