/// <reference path="./all.d.ts" />

declare module 'nervous' {
  // LAYER DEFINITION FILE
  export class Layer {
    static currentId: number;
    id: string;
    protected neurons: Neuron[];
    constructor(size: number, activationFunctions: IActivationFunctions);
    neuronsValue: number[];
    linkTo(layer: Layer): ISynapsesLayer;
    forEachNeuron(func: (x: Neuron, index?: number) => void): void;
    activate(): void;
    computeErrors(): void;
    computeDeltas(): void;
  }
  export class InputLayer extends Layer {
      constructor(size: number, activationFunctions: IActivationFunctions);
      activate(): void;
  }
  export class HiddenLayer extends Layer {
      constructor(size: number, activationFunctions: IActivationFunctions);
  }
  export class OutputLayer extends Layer {
      constructor(size: number, activationFunctions: IActivationFunctions);
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
    constructor(layer: Layer, position: number, activationFunctions: IActivationFunctions);
    A: number;
    Z: number;
    delta: number;
    addInputSynapse(s: Synapse): void;
    addOutputSynapse(s: Synapse): void;
    activate(): void;
    computeError(): void;
    backPropagate(): void;
  }
  export class BiasNeuron extends Neuron {
      constructor(layer: Layer, position: number, activationFunctions: IActivationFunctions);
      A: number;
  }
  export class HiddenNeuron extends Neuron {
      constructor(layer: Layer, position: number, activationFunctions: IActivationFunctions);
  }
  export class InputNeuron extends Neuron {
      constructor(layer: Layer, position: number, activationFunctions: IActivationFunctions);
  }
  export class OutputNeuron extends Neuron {
      constructor(layer: Layer, position: number, activationFunctions: IActivationFunctions);
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
      constructor(input: Neuron, output: Neuron);
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
  }
  export interface ITuple {
      input: Array<number>;
      output?: Array<number>;
  }
  export interface ITrainingData extends Array<ITuple> {
  }
  export interface ITrainingOutput {
      error: number[];
  }
  export class NeuralNetwork {
      private config;
      private neuronsLayers;
      private synapsesLayers;
      private numberOfSynapses;
      private inputLayer;
      private outputLayer;
      constructor(config: INeuralNetworkConfiguration);
      weights: number[];
      getGradients(data: ITrainingData): number[];
      forEachSynapse(func: (x: Synapse, indexI?: number, indexJ?: number) => void): void;
      forward(data: ITrainingData): number[][];
      cost(data: ITrainingData): number[];
      backward(data: ITrainingData): ISynapsesLayer[];
      adjustWeigths(synapses: ISynapsesLayer[], batchSize: number): void;
      train(data: ITrainingData, options?: ITrainingConfiguration): ITrainingOutput;
  }
  export function computeNumericalGradients(n: NeuralNetwork, data: ITrainingData): number[];
  
}