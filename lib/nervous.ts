/// <reference path="./all.d.ts" />

declare module 'nervous' {
  // COST DEFINTION FILE
  export enum ECostStrategy {
    Quadratic = 0,
    CrossEntropy = 1,
  }
  export class CostStrategy {
      protected activationFunctions: IActivationFunctions;
      constructor(activationFunctions: IActivationFunctions);
      fn(data: number[], yHat: number[]): number;
      delta(A: number, Z: number): number;
  }
  export class QuadraticCost extends CostStrategy {
      fn(data: number[], yHat: number[]): number;
      delta(A: number, Z: number): number;
  }
  export class CrossEntropyCost extends CostStrategy {
      fn(data: number[], yHat: number[]): number;
      delta(A: number, Z: number): number;
  }

  // LAYER DEFINITION FILE
  export class Layer {
      static currentId: number;
      id: string;
      protected neurons: Neuron[];
      constructor(size: number);
      neuronsValue: number[];
      linkTo(layer: Layer): ISynapsesLayer;
      forEachNeuron(func: (x: Neuron, index?: number) => void): void;
      activate(activationFunctions: IActivationFunctions): void;
      computeErrors(costStrategy: CostStrategy): void;
      computeDeltas(): void;
  }
  export class InputLayer extends Layer {
      constructor(size: number);
      activate(): void;
  }
  export class HiddenLayer extends Layer {
      constructor(size: number);
  }
  export class OutputLayer extends Layer {
      constructor(size: number);
  }
  
  //NEURON DEFINITION FILE
  export class Neuron {
    private layer;
    id: string;
    private activation;
    private activationPrime;
    private inputSynapses;
    private outputSynapses;
    protected activatedValue: number;
    private preActivatedValue;
    private error;
    constructor(layer: Layer, position: number);
    A: number;
    Z: number;
    delta: number;
    addInputSynapse(s: Synapse): void;
    addOutputSynapse(s: Synapse): void;
    activate(activationFunctions: IActivationFunctions): void;
    computeError(costStrategy: CostStrategy): void;
    backPropagate(): void;
  }
  export class BiasNeuron extends Neuron {
      constructor(layer: Layer, position: number);
      A: number;
  }
  export class HiddenNeuron extends Neuron {
      constructor(layer: Layer, position: number);
  }
  export class InputNeuron extends Neuron {
      constructor(layer: Layer, position: number);
  }
  export class OutputNeuron extends Neuron {
      constructor(layer: Layer, position: number);
  }
  
  //SYNAPSE DEFINITION FILE
  export interface ISynapsesLayer extends Array<Synapse> {
  }
  export interface INeuronsEnd {
      input: Neuron;
      output: Neuron;
  }
  export class Synapse {
      private input;
      private output;
      id: string;
      private value;
      private dJdW;
      constructor(input: Neuron, output: Neuron, weight: number);
      neurons: INeuronsEnd;
      weight: number;
      gradient: number;
  }

  
  //NEURAL-NETWORK DEFINITION FILE
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
  export interface ITrainingData extends Array<ITuple> {
  }
  export interface ITrainingOutput {
      error: number;
  }
  export class NeuralNetwork {
      private config;
      private neuronsLayers;
      private synapsesLayers;
      private numberOfSynapses;
      private inputLayer;
      private outputLayer;
      private activationFunctions;
      private costStrategy;
      constructor(config: INeuralNetworkConfiguration);
      weights: number[];
      getGradients(data: ITrainingData): number[];
      forEachSynapse(func: (x: Synapse, indexI?: number, indexJ?: number) => void): void;
      forward(data: ITrainingData): number[][];
      cost(data: ITrainingData): number;
      backward(data: ITrainingData): ISynapsesLayer[];
      adjustWeigths(synapses: ISynapsesLayer[], batchSize: number, dataSize: number): void;
      train(data: ITrainingData, options?: ITrainingConfiguration): ITrainingOutput;
  }
  export function computeNumericalGradients(n: NeuralNetwork, data: ITrainingData): number[];

}