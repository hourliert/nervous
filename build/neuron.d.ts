/// <reference path="../lib/all.d.ts" />
import { IActivationFunctions } from './neural-network';
import { Layer } from './layer';
import { Synapse } from './synapse';
import { CostStrategy } from './cost';
export declare class Neuron {
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
export declare class BiasNeuron extends Neuron {
    constructor(layer: Layer, position: number);
    A: number;
}
export declare class HiddenNeuron extends Neuron {
    constructor(layer: Layer, position: number);
}
export declare class InputNeuron extends Neuron {
    constructor(layer: Layer, position: number);
}
export declare class OutputNeuron extends Neuron {
    constructor(layer: Layer, position: number);
}
