/// <reference path="all.d.ts" />
declare module 'nervous' {
    enum ECostStrategy {
        Quadratic = 0,
        CrossEntropy = 1,
    }
    class CostStrategy {
        protected activationFunctions: IActivationFunctions;
        constructor(activationFunctions: IActivationFunctions);
        fn(data: number[], yHat: number[]): number;
        delta(A: number, Z: number): number;
    }
    class QuadraticCost extends CostStrategy {
        fn(data: number[], yHat: number[]): number;
        delta(A: number, Z: number): number;
    }
    class CrossEntropyCost extends CostStrategy {
        fn(data: number[], yHat: number[]): number;
        delta(A: number, Z: number): number;
    }
    class Layer {
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
    class InputLayer extends Layer {
        constructor(size: number);
        activate(): void;
    }
    class HiddenLayer extends Layer {
        constructor(size: number);
    }
    class OutputLayer extends Layer {
        constructor(size: number);
    }
    class Neuron {
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
    class BiasNeuron extends Neuron {
        constructor(layer: Layer, position: number);
        A: number;
    }
    class HiddenNeuron extends Neuron {
        constructor(layer: Layer, position: number);
    }
    class InputNeuron extends Neuron {
        constructor(layer: Layer, position: number);
    }
    class OutputNeuron extends Neuron {
        constructor(layer: Layer, position: number);
    }
    interface ISynapsesLayer extends Array<Synapse> {
    }
    interface INeuronsEnd {
        input: Neuron;
        output: Neuron;
    }
    class Synapse {
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
    interface IActivationFunctions {
        activation: (z: number) => number;
        activationPrime: (z: number) => number;
    }
    interface ITrainingConfiguration {
        regularization?: number;
        batchSize?: number;
        learningRate?: number;
        iterations?: number;
        log?: boolean;
    }
    interface INeuralNetworkConfiguration {
        inputLayerSize: number;
        hiddenLayers?: number[];
        outputLayerSize: number;
        trainingOptions?: ITrainingConfiguration;
        costStrategy?: ECostStrategy;
    }
    interface ITuple {
        input: Array<number>;
        output?: Array<number>;
    }
    interface ITrainingData extends Array<ITuple> {
    }
    interface ITrainingOutput {
        error: number;
    }
    class NeuralNetwork {
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
    function computeNumericalGradients(n: NeuralNetwork, data: ITrainingData): number[];
}
