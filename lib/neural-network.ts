/// <reference path="../typings/tsd.d.ts" />

import {add, sub, multiplyByScalar, addScalar, sum, zeros, shuffle} from 'nervous-array';
import {sigmoid, sigmoidPrime} from 'nervous-sigmoid';

import {Layer, InputLayer, HiddenLayer, OutputLayer} from './layer';
import {Synapse, ISynapsesLayer} from './synapse';


export interface IActivationFunctions {
  activation: (z: number) => number;
  activationPrime: (z: number) => number;
}

export interface INeuralNetworkConfiguration {
  inputLayerSize: number;
  hiddenLayers?: number[];
  outputLayerSize: number;
  iterations?: number;
  learningRate?: number;
  batchSize?: number;
  log?: boolean;
}

export interface ITuple {
  input: Array<number>;
  output?: Array<number>; 
}
export interface ITrainingData extends Array<ITuple> {}

export interface IInputPattern extends Array<number> {}
export interface IOutputPattern extends Array<number> {}

export interface ITrainOutput {
  error: number[]
}

export class NeuralNetwork {
  
  private neuronsLayers: Layer[];
  private synapsesLayers: ISynapsesLayer[];
  private numberOfSynapses: number;
  private inputLayer: InputLayer;
  private outputLayer: OutputLayer;

  constructor (
    private config: INeuralNetworkConfiguration
  ) {
    
    this.config.hiddenLayers = this.config.hiddenLayers || [this.config.inputLayerSize];
    this.config.iterations = this.config.iterations || 10000;
    this.config.learningRate = (this.config.learningRate === undefined) ? 0.5 : this.config.learningRate;
    this.config.batchSize = (this.config.batchSize === undefined) ? 10 : this.config.batchSize;
    
    let activationFunctions = {
      activation: sigmoid,
      activationPrime: sigmoidPrime
    };

    this.neuronsLayers = [];
    this.synapsesLayers = [];
    this.numberOfSynapses = 0;

    //layers creation
    this.neuronsLayers.push(this.inputLayer = new InputLayer(config.inputLayerSize, activationFunctions));
    for (let i = 0 ; i < config.hiddenLayers.length ; i++) {
      this.neuronsLayers.push(new HiddenLayer(config.hiddenLayers[i], activationFunctions));
    }
    this.neuronsLayers.push(this.outputLayer = new OutputLayer(config.outputLayerSize, activationFunctions));

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

  public forward (data: ITrainingData): IOutputPattern[] {

    let ret = [];

    for (let k = 0 ; k < data.length ; k ++ ) {
      
      //set input to input layer neurons
      this.inputLayer.neuronsValue = data[k].input;
      //propagate on each hidden layer and output
      for (let i = 1 ; i < this.neuronsLayers.length ; i++) {
        this.neuronsLayers[i].activate();
      }
      //retrieve output neuron value
      ret.push(this.outputLayer.neuronsValue);
      
    }
    return ret;
    
  }

  public cost (data: ITrainingData): number[] {

    let j = zeros(data[0].output.length), //the number of output neurons
        yHats = this.forward(data),
        weightsSum = 0;

    for (let k = 0; k < data.length; k++) {
      
      let difference = sub(data[k].output, yHats[k]).map((x) => Math.pow(x, 2));
      j = add(j, difference);
      
    }
    
    j = multiplyByScalar(j, 0.5);
    
    return j;
    
  }

  public backward (data: ITrainingData): ISynapsesLayer[] {

    let ret = [];

    for (let k = 0 ; k < data.length ; k ++ ) {
      
      let tuple = data[k],
          yHat = this.forward([tuple])[0];

      //set the input and output layer value
      this.inputLayer.neuronsValue = tuple.input;
      this.outputLayer.neuronsValue = sub(tuple.output, yHat);
      //compute propagation errors for all layers expect input
      for (let i = this.neuronsLayers.length - 1 ; i >= 1 ; i--) {
        this.neuronsLayers[i].computeErrors();
      }
      //compute dJdW for all synapses layer
      for (let i = 0 ; i < this.neuronsLayers.length  ; i++) {
        this.neuronsLayers[i].computeDeltas();
      }

    }
    
    return this.synapsesLayers;

  }

  public adjustWeigths (synapses: ISynapsesLayer[]) {

    if (synapses.length !== this.synapsesLayers.length) {
      throw new Error(`The number of synapses layers differs.`);
    }
    for (let i = 0; i < synapses.length ; i++) {
      if (synapses[i].length !== this.synapsesLayers[i].length) {
        throw new Error(`The number of synapses in the ${i} layer differs`);
      }
    }
    
    this.forEachSynapse((s) => {
      s.weight = s.weight - s.gradient * this.config.learningRate;
      s.gradient = 0;
    });
    
  }
  
  public train (data: ITrainingData): ITrainOutput {
    
    let iterations = this.config.iterations;
    
    for (let i = 0 ; i < iterations ; i++) {
      
      shuffle(data);
      
      let batch = data.slice(0, this.config.batchSize);
      
      let synapses = this.backward(batch);
      this.adjustWeigths(synapses);
      
      if (this.config.log && (i % (iterations/100) === 0)) {
        let cost = this.cost(data);
        console.info(`Progress ${i / iterations}, cost: ${cost}`);
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
    gradients[k] = sum(multiplyByScalar(sub(loss2, loss1), 1 / (epsilon * 2)));
    perturb[k] = 0;

  }
  n.weights = initialWeights;
  return gradients;

}
