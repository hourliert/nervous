/// <reference path="../lib/all.d.ts" />
import { Neuron } from './neuron';
export interface ISynapsesLayer extends Array<Synapse> {
}
export interface INeuronsEnd {
    input: Neuron;
    output: Neuron;
}
export declare class Synapse {
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
