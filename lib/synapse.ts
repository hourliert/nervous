/// <reference path="./all.d.ts" />

import {Neuron} from './neuron';

export interface ISynapsesLayer extends Array<Synapse> {}
export interface INeuronsEnd {
  input: Neuron;
  output: Neuron;
}

export class Synapse {
  public id: string;
  private value: number;
  private dJdW: number;

  constructor (
    private input: Neuron,
    private output: Neuron
  ) {
    this.id = `s_${input.id}_${output.id}`;
    this.weight = (Math.random() * 0.4) + 0.2;
    this.gradient = 0;
  }
  
  get neurons(): INeuronsEnd {
    return {
      input: this.input, 
      output: this.output
    };
  }
  set neurons(neurons: INeuronsEnd) {
    this.input = neurons.input;
    this.output = neurons.output;
  }
  
  get weight (): number {
    return this.value;
  }
  set weight (value: number) {
    this.value = value;
  }
  
  get gradient (): number {
    return this.dJdW;
  }
  set gradient (value: number) {
    this.dJdW = value;
  }
}
