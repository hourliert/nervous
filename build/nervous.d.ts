// Generated by dts-bundle v0.3.0

declare module 'nervous' {
    export { NeuralNetwork } from '__nervous/neural-network';
}

declare module '__nervous/neural-network' {
    import { Synapse, ISynapsesLayer } from '__nervous/synapse';
    import { ECostStrategy } from '__nervous/cost';
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
    export function computeNumericalGradients(n: NeuralNetwork, data: ITrainingData): number[];
}

declare module '__nervous/synapse' {
    import { Neuron } from '__nervous/neuron';
    export interface ISynapsesLayer extends Array<Synapse> {
    }
    export interface INeuronsEnd {
        input: Neuron;
        output: Neuron;
    }
    export class Synapse {
        id: string;
        constructor(input: Neuron, output: Neuron, weight: number);
        neurons: INeuronsEnd;
        weight: number;
        gradient: number;
    }
}

declare module '__nervous/cost' {
    import { IActivationFunctions } from '__nervous/neural-network';
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
}

declare module '__nervous/neuron' {
    import { IActivationFunctions } from '__nervous/neural-network';
    import { Layer } from '__nervous/layer';
    import { Synapse } from '__nervous/synapse';
    import { CostStrategy } from '__nervous/cost';
    export class Neuron {
        id: string;
        protected activatedValue: number;
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
}

declare module '__nervous/layer' {
    import { Neuron } from '__nervous/neuron';
    import { ISynapsesLayer } from '__nervous/synapse';
    import { IActivationFunctions } from '__nervous/neural-network';
    import { CostStrategy } from '__nervous/cost';
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
        computeGradients(): void;
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
}
