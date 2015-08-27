/// <reference path="../lib//all.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';

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
      
      let exception: Error = undefined;
      try {
        output.neuronsValue = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
        ];
      } catch (e) {
        exception = e;
      } finally {
        expect(exception).to.be.an.instanceOf(Error);
        expect(exception.message).to.be.equal('The size of the input 13 differs fron the number of neurons 10');
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
      let cb = sinon.spy();
      output.forEachNeuron(cb);
      
      expect(cb.callCount).to.be.equal(size);
      for (let i = 0; i < size; i++) {
        expect(cb.calledWith(output.neurons[i], i)).to.be.ok;
      }
    });
    
    it ('should activate on each neurons', () => {
      let activations = {
          activation: x => 1,
          activationPrime: x => 2
        };
      let spies = [];
      
      for (let i = 0; i < size; i++) {
        spies.push(sinon.spy(output.neurons[i], 'activate'));
      }
        
      output.activate(activations);
      
      for (let i = 0; i < size; i++) {
        expect(spies[i].calledOnce).to.be.ok;
        expect(spies[i].calledWith(activations)).to.be.ok;
      }
    });
    
    it ('should compute error of each neurons', () => {
      let cost = {
            delta: x => 1
          };
      let spies = [];
      
      for (let i = 0; i < size; i++) {
        spies.push(sinon.spy(output.neurons[i], 'computeError'));
      }
        
      output.computeErrors(cost);
      
      for (let i = 0; i < size; i++) {
        expect(spies[i].calledOnce).to.be.ok;
        expect(spies[i].calledWith(cost)).to.be.ok;
      }
    });
    
    it ('should compute gradient of each neurons', () => {
      let spies = [];
      
      for (let i = 0; i < size; i++) {
        spies.push(sinon.spy(output.neurons[i], 'backPropagate'));
      }
        
      output.computeGradients();
      
      for (let i = 0; i < size; i++) {
        expect(spies[i].calledOnce).to.be.ok;
      }
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