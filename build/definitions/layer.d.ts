/// <reference path="all.d.ts" />
import { Neuron } from './neuron';
import { ISynapsesLayer } from './synapse';
import { IActivationFunctions } from './neural-network';
import { CostStrategy } from './cost';
export declare class Layer {
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
export declare class InputLayer extends Layer {
    constructor(size: number);
    activate(): void;
}
export declare class HiddenLayer extends Layer {
    constructor(size: number);
}
export declare class OutputLayer extends Layer {
    constructor(size: number);
}
