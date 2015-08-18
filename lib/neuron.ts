/// <reference path="./all.d.ts" />


import {IActivationFunctions} from './neural-network';
import {Layer} from './layer';
import {Synapse} from './synapse';

import {CostStrategy, QuadraticCost, CrossEntropyCost} from './cost';

export class Neuron {
  public id: string;
  
  private activation: (z: number) => number;
  private activationPrime: (z: number) => number;
  
  private inputSynapses: Synapse[];
  private outputSynapses: Synapse[];
  
  protected activatedValue: number;
  private preActivatedValue: number;
  private error: number;
  
  constructor (
    private layer: Layer,
    position: number
  ) {
    
    this.id = `n_${this.layer.id}_${position}`;
    this.A = 0;
    this.Z = 0;
    
    this.inputSynapses = [];
    this.outputSynapses = [];
    
  }
  
  get A(): number {
    return this.activatedValue;
  }
  set A(activatedValue: number) {
    this.activatedValue = activatedValue;
  }
  
  get Z(): number {
    return this.preActivatedValue;
  }
  set Z(preActivatedValue: number) {
    this.preActivatedValue = preActivatedValue;
  }
  
  get delta(): number {
    return this.error;
  }
  set delta (error: number) {
    this.error = error;
  }
  
  public addInputSynapse (s: Synapse) {
    this.inputSynapses.push(s);
  }
  public addOutputSynapse (s: Synapse) {
    this.outputSynapses.push(s);
  }
  
  public activate (activationFunctions: IActivationFunctions) {
    
    let sum = 0;
    for (let i = 0 ; i < this.inputSynapses.length ; i++) {
      let s = this.inputSynapses[i];
      sum += s.weight * s.neurons.input.A;
    }
    this.Z = sum;
    this.A = activationFunctions.activation(sum);
    
  }
  
  public computeError (costStrategy: CostStrategy) {
    
    let delta = 0;
    for (let i = 0 ; i < this.outputSynapses.length ; i++) {
      
      let s = this.outputSynapses[i];   
      delta = delta + s.neurons.output.delta * s.weight;
      
    }
    
    this.error = costStrategy.delta(delta || this.A, this.Z);
    
  }
  
  public backPropagate () {
    
    for (let i = 0 ; i < this.outputSynapses.length ; i++) {
      let s = this.outputSynapses[i]; 
      s.gradient = s.gradient + this.A * s.neurons.output.delta;
    }
  }
}

export class BiasNeuron extends Neuron {
  
  constructor (
    layer: Layer,
    position: number
  ) {
    super(layer, position);
    this.A = 1;
  }
  
  get A (): number {
    return 1;
  }
  set A (value: number) {
    this.activatedValue = 1;
  }
}

export class HiddenNeuron extends Neuron {
  
  constructor (
    layer: Layer,
    position: number
  ) {
    super(layer, position);
  }
}

export class InputNeuron extends Neuron {
  
  constructor (
    layer: Layer,
    position: number
  ) {
    super(layer, position);
  }
}

export class OutputNeuron extends Neuron {
  
  constructor (
    layer: Layer,
    position: number
  ) {
    super(layer, position);
  }
}

