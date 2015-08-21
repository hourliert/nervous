/// <reference path="./all.d.ts" />

import {add, sub, multiplyByScalar, addScalar, sum, zeros, shuffle, rootMeanSquare} from 'nervous-array';
import {sigmoid, sigmoidPrime} from 'nervous-sigmoid';

import {Layer, InputLayer, HiddenLayer, OutputLayer} from './layer';
import {Synapse, ISynapsesLayer} from './synapse';
import {CostStrategy, ECostStrategy, QuadraticCost, CrossEntropyCost} from './cost';

import './polyfills/assign';

export interface IActivationFunctions {
  activation: (z: number) => number;
  activationPrime: (z: number) => number;
}

export interface ITrainingConfiguration {
  regularization?: number;
  batchSize?: number;
  learningRate?: number;
  iterations?: number;
  log?: boolean;
}
export interface INeuralNetworkConfiguration {
  inputLayerSize: number;
  hiddenLayers?: number[];
  outputLayerSize: number;
  trainingOptions?: ITrainingConfiguration;
  costStrategy?: ECostStrategy;
}

export interface ITuple {
  input: Array<number>;
  output?: Array<number>; 
}
export interface ITrainingData extends Array<ITuple> {}

export interface ITrainingOutput {
  error: number
}

export class NeuralNetwork {
  
  private neuronsLayers: Layer[];
  private synapsesLayers: ISynapsesLayer[];
  private numberOfSynapses: number;
  private inputLayer: InputLayer;
  private outputLayer: OutputLayer;
  
  private activationFunctions: IActivationFunctions;
  private costStrategy: CostStrategy;

  constructor (
    private config: INeuralNetworkConfiguration
  ) {
    
    this.config.hiddenLayers = this.config.hiddenLayers || [this.config.inputLayerSize];
    
    this.config.trainingOptions = this.config.trainingOptions || {};
    this.config.trainingOptions.iterations = this.config.trainingOptions.iterations || 10000;
    this.config.trainingOptions.batchSize = this.config.trainingOptions.batchSize || 10;
    this.config.trainingOptions.regularization = (this.config.trainingOptions.regularization === undefined) ? 0.0001 : this.config.trainingOptions.regularization;
    this.config.trainingOptions.learningRate = (this.config.trainingOptions.learningRate === undefined) ? 0.5 : this.config.trainingOptions.learningRate;
    
    this.activationFunctions = {
      activation: sigmoid,
      activationPrime: sigmoidPrime
    };
    
    switch (this.config.costStrategy) {
      case ECostStrategy.Quadratic:
      default:
        this.costStrategy = new QuadraticCost(this.activationFunctions);
        break;
      case ECostStrategy.CrossEntropy:
        this.costStrategy = new CrossEntropyCost(this.activationFunctions);
        break;
    }
   
    this.neuronsLayers = [];
    this.synapsesLayers = [];
    this.numberOfSynapses = 0;

    //layers creation
    this.neuronsLayers.push(this.inputLayer = new InputLayer(config.inputLayerSize));
    for (let i = 0 ; i < config.hiddenLayers.length ; i++) {
      this.neuronsLayers.push(new HiddenLayer(config.hiddenLayers[i]));
    }
    this.neuronsLayers.push(this.outputLayer = new OutputLayer(config.outputLayerSize));

    //synapses creation
    for (let j = 0 ; j < this.neuronsLayers.length - 1; j++) {
      let synapses = this.neuronsLayers[j].linkTo(this.neuronsLayers[j + 1]);
      this.synapsesLayers.push(synapses);
      this.numberOfSynapses += synapses.length;
    }

  }

  get weights (): number[] {
    
    let weights = [];
    
    this.forEachSynapse((s) => {
      weights.push(s.weight);
    });
    return weights;
    
  }
  set weights (synapses: number[]) {
    
    if (synapses.length !== this.numberOfSynapses) {
      throw new Error(`The number of synapses differs.`);
    }
    
    let cpt = 0;
    
    this.forEachSynapse((s) => {
      s.weight = synapses[cpt++];
    });
    
  }
  
  public getGradients (data: ITrainingData): number[] {
    
    let gradients = []; 
    
    this.backward(data);
    this.forEachSynapse((s) => {
      gradients.push(s.gradient);
    });
    return gradients;
    
  }
  
  public forEachSynapse (func: (x: Synapse, indexI?: number, indexJ?: number) => void) {
    
    for (let i = 0; i < this.synapsesLayers.length ; i++) {
      for (let j = 0; j < this.synapsesLayers[i].length ; j++) {
        func(this.synapsesLayers[i][j], i, j);
      }
    }
    
  }

  public forward (data: ITrainingData): number[][] {

    let ret = [];

    for (let k = 0 ; k < data.length ; k ++ ) {
      
      //set input to input layer neurons
      this.inputLayer.neuronsValue = data[k].input;
      //propagate on each hidden layer and output
      for (let i = 1 ; i < this.neuronsLayers.length ; i++) {
        this.neuronsLayers[i].activate(this.activationFunctions);
      }
      //retrieve output neuron value
      ret.push(this.outputLayer.neuronsValue);
      
    }
    return ret;
    
  }

  public cost (data: ITrainingData): number {

    let yHats = this.forward(data),
        j: number = 0,
        weightsSum = 0;
    
    for (let k = 0; k < data.length; k++) {
      j += this.costStrategy.fn(data[k].output, yHats[k]);
    }
    
    j = j / data.length;
    
    this.forEachSynapse((s) => {
      weightsSum += Math.pow(s.weight, 2);
    });
    
    j += this.config.trainingOptions.regularization / (2 * data.length) * weightsSum;
    
    return j;
 
  }

  public backward (data: ITrainingData): ISynapsesLayer[] {

    let ret = [];

    for (let k = 0 ; k < data.length ; k ++ ) {
      
      let tuple = data[k],
          yHat = this.forward([tuple])[0];

      //set the input and output layer value
      this.inputLayer.neuronsValue = tuple.input;
      this.outputLayer.neuronsValue = sub(yHat, tuple.output);
      //compute propagation errors for all layers expect input
      for (let i = this.neuronsLayers.length - 1 ; i >= 1 ; i--) {
        this.neuronsLayers[i].computeErrors(this.costStrategy);
      }
      //compute dJdW for all synapses layer
      for (let i = 0 ; i < this.neuronsLayers.length  ; i++) {
        this.neuronsLayers[i].computeGradients();
      }

    }
    
    return this.synapsesLayers;

  }

  public adjustWeights (synapses: ISynapsesLayer[], batchSize: number, dataSize: number) {

    if (synapses.length !== this.synapsesLayers.length) {
      throw new Error(`The number of synapses layers differs.`);
    }
    for (let i = 0; i < synapses.length ; i++) {
      if (synapses[i].length !== this.synapsesLayers[i].length) {
        throw new Error(`The number of synapses in the ${i} layer differs`);
      }
    }
    
    this.forEachSynapse((s) => {
      s.weight = (1 - this.config.trainingOptions.learningRate * this.config.trainingOptions.regularization / dataSize) * s.weight - this.config.trainingOptions.learningRate / batchSize * s.gradient;
      s.gradient = 0;
    });
    
  }
  
  public train (data: ITrainingData, options?: ITrainingConfiguration): ITrainingOutput {
    
    Object.assign(this.config.trainingOptions, options);
    
    let iterations = this.config.trainingOptions.iterations,
        batchSize = this.config.trainingOptions.batchSize = (this.config.trainingOptions.batchSize > data.length) ? data.length : this.config.trainingOptions.batchSize;
    
    for (let i = 0 ; i < iterations ; i++) {
      
      if (batchSize && batchSize !== data.length) {
        shuffle(data);
      }
      
      let batch = data.slice(0, batchSize), 
          synapses = this.backward(batch);
          
      this.adjustWeights(synapses, batchSize, data.length);
      
      if (this.config.trainingOptions.log && (i % (iterations/100) === 0)) {
        console.info(`Progress ${i / iterations}, cost: ${this.cost(data)}`);
      }
    
    }
    return {
      error: this.cost(data)
    };
    
  }
  
}

export function computeNumericalGradients (n: NeuralNetwork, data: ITrainingData) {

  let epsilon = 1e-4,
      initialWeights: number[] = n.weights,
      numGrads = initialWeights.length,
      gradients: number[] = zeros(numGrads),
      perturb: Array<number> = zeros(numGrads),
      k;
    
  for (k = 0; k < numGrads; k++) {

    let loss1, loss2;

    perturb[k] = epsilon;
    n.weights = add(initialWeights, perturb);
    loss2 = n.cost(data);
    n.weights = sub(initialWeights, perturb);
    loss1 = n.cost(data)
    gradients[k] = data.length * sum(multiplyByScalar(sub([loss2], [loss1]), 1 / (epsilon * 2)));
    perturb[k] = 0;

  }
  n.weights = initialWeights;
  return gradients;

}
