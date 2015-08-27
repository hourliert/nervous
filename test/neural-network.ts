/// <reference path="../lib//all.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';

import {NeuralNetwork, computeNumericalGradients} from '../lib/neural-network';
import {rootMeanSquare, sub, add} from 'nervous-array';

let expect = chai.expect;

describe('Neural Network', function() {
  this.timeout(10000);    
  
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
        iterations: 10,
        learningRate: 1,
        batchSize: 2,        
        log: true
      },
      costStrategy: 0
    };
    nn = new NeuralNetwork(config);
  });
  
  it ('should be defined', () => {
    expect(nn).to.be.ok;
  });
  
  it ('should cover default parameters of neural network constructor', () => {
    let config = <any>{
      inputLayerSize: 2,
      hiddenLayers: [3],
      outputLayerSize: 1,
      trainingOptions: {
        regularization: 0,
        iterations: 100,
        learningRate: 1,
        log: false
      },
      costStrategy: 0
    };
    expect(new NeuralNetwork(config)).to.be.ok;
    config.costStrategy = 1;
    expect(new NeuralNetwork(config)).to.be.ok;
    config.trainingOptions.iterations = null;
    expect(new NeuralNetwork(config)).to.be.ok;
    config.hiddenLayers = 3;
    expect(new NeuralNetwork(config)).to.be.ok;
    config.trainingOptions.regularization = null;
    expect(new NeuralNetwork(config)).to.be.ok;
    config.trainingOptions.learningRate = null;
    expect(new NeuralNetwork(config)).to.be.ok;
    config.trainingOptions = null;
    expect(new NeuralNetwork(config)).to.be.ok;
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
    
    let weights2 = [];
    
    // with biases
    for (let i = 0; i < 15; i++) {
      weights2.push(i);
    }

    // how could I test that a setter/getter throw with chai ?
    // i couldn't .bind the setter...
    let exception: Error = undefined;
    try {
      nn.weights = weights2;
    } catch (e) {
      exception = e;
      expect(e).to.be.ok;
    } finally {
      expect(exception).to.be.an.instanceOf(Error);
      expect(exception.message).to.be.equal('The number of synapses differs.');
    }   
  });
  
  it ('should get the network gradients', () => {
    expect(nn.getGradients(data).length).to.be.equal(16);
  });
  
  it ('should apply a function on each synapse', () => {
    let spy = sinon.spy();
    nn.forEachSynapse(spy);
    
    expect(spy.called).to.be.ok;
    for (let i = 0; i < nn.synapsesLayers.length; i++) {
      for (let j = 0; j < nn.synapsesLayers[i].length; j++) {
        expect(spy.calledWith(nn.synapsesLayers[i][j], i, j)).to.be.ok;
      }
    }
  });
  
  it ('should forward the data through the network', () => {
    let spies = [];
    
    for (let i = 1 ; i < nn.neuronsLayers.length ; i++) {
      spies.push(sinon.spy(nn.neuronsLayers[i], 'activate'));
    }
    
    let res = nn.forward(data);
    expect(res.length).to.be.equal(4);
    expect(res[0].length).to.be.equal(1);
    expect(res[1].length).to.be.equal(1);
    expect(res[2].length).to.be.equal(1);
    expect(res[3].length).to.be.equal(1);
    
    for (let i = 1 ; i < spies.length ; i++) {
      expect(spies[i].called).to.be.ok;
    } 
  });
  
  it ('should compute the cost to the origin data', () => {
    let spyForward = sinon.spy(nn, 'forward'),
        spyCost = sinon.stub(nn.costStrategy, 'fn');
        
    spyCost.onCall(0).returns(1);
    spyCost.onCall(1).returns(2);
    spyCost.onCall(2).returns(3);
    spyCost.returns(4);
    
    let res = nn.cost(data);
    expect(res).to.be.a('number');
    expect(res).to.be.equal(2.5);
    expect(spyForward.called).to.be.ok;
    expect(spyCost.called).to.be.ok;
  });
  
  it ('should backpropagate some data in the network', () => {
    let spyForward = sinon.spy(nn, 'forward');
    let spiesErrors = [],
        spiesGradients = [];
    
    for (let i = nn.neuronsLayers.length - 1 ; i >= 1 ; i--) {
      spiesErrors.push(sinon.spy(nn.neuronsLayers[i], 'computeErrors'));
    }
    for (let i = 0 ; i < nn.neuronsLayers.length  ; i++) {
      spiesGradients.push(sinon.spy(nn.neuronsLayers[i], 'computeGradients'));
    }

    
    let res = nn.backward(data);
    
    expect(res.length).to.be.equal(2);
    expect(res[0].length).to.be.equal(12);
    expect(res[1].length).to.be.equal(4);
    
    for (let i = 0; i < spiesErrors.length ; i ++) {
      expect(spiesErrors[i].called).to.be.ok;
    }
    for (let i = 0; i < spiesGradients.length ; i ++) {
      expect(spiesGradients[i].called).to.be.ok;
    }
  });
  
  it ('should adjust the network weights', () => {
    let synapses = [[], []],
        curLayer = 0,
        exception: Error = undefined;
    
    //2 synapses layers
    for (let i = 0 ; i < 16; i++) {
      let index = (i < 12) ? 0 : 1;
      synapses[index].push(1);
    }
    
    nn.adjustWeights(synapses, 1, 1);
    
    for (let i = 0 ; i < 16; i++) {
      let index = (i < 12) ? 0 : 1,
          j = (i < 12) ? i : (15 - i);
      expect(nn.synapsesLayers[index][j].weight).to.be.a('number');
      expect(nn.synapsesLayers[index][j].gradient).to.be.equal(0);
    }
    
    synapses = [[], [], [], []];
    curLayer = 0;
    //4 synapses layers
    for (let i = 0 ; i < 16; i++) {
      if (i % 6 === 0) {
        curLayer++;
      }
      synapses[curLayer].push(1);
    }
    
    exception = undefined;
    try {
      nn.adjustWeights(synapses, 1, 1);
    } catch (e) {
      exception = e;
      expect(e).to.be.ok;
    } finally {
      expect(exception).to.be.an.instanceOf(Error);
      expect(exception.message).to.be.equal('The number of synapses layers differs.');
    }
    
    synapses = [[], []];
    curLayer = 0;
    //4 synapses layers
    for (let i = 0 ; i < 40; i++) {
      let index = (i < 12) ? 0 : 1;
      synapses[index].push(1);
    }
    
    exception = undefined;
    try {
      nn.adjustWeights(synapses, 1, 1);
    } catch (e) {
      exception = e;
      expect(e).to.be.ok;
    } finally {
      expect(exception).to.be.an.instanceOf(Error);
      expect(exception.message).to.be.equal('The number of synapses in the 1 layer differs');
    }  

    
    
  });
  
  it ('should train the network', () => {
    let res, 
        spy = sinon.spy(nn, 'adjustWeights');
    
    res = nn.train(data);
    
    expect(res.error).to.be.a('number');
    expect(spy.callCount).to.be.equal(10);
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