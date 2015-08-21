/// <reference path="all.d.ts" />
import { Synapse, ISynapsesLayer } from './synapse';
import { ECostStrategy } from './cost';
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
export declare class NeuralNetwork {
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
    adjustWeights(synapses: ISynapsesLayer[], batchSize: number, dataSize: number): void;
    train(data: ITrainingData, options?: ITrainingConfiguration): ITrainingOutput;
}
export declare function computeNumericalGradients(n: NeuralNetwork, data: ITrainingData): number[];
