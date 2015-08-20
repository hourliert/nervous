/// <reference path="./all.d.ts" />

import {Neuron, BiasNeuron, InputNeuron, HiddenNeuron, OutputNeuron} from './neuron';
import {Synapse, ISynapsesLayer} from './synapse';
import {IActivationFunctions} from './neural-network';
import {CostStrategy} from './cost';


export class Layer {
  
  static currentId: number = 0;
  
  public id: string;
  protected neurons: Neuron[];
  
  constructor (
    size: number
  ) {
    
    this.id = `l_${Layer.currentId++}`;
    this.neurons = [];
      
  }
  
  get neuronsValue (): number[] {
    
    let ret = [];
    this.forEachNeuron((n) => ret.push(n.A));
    return ret;
    
  }
  set neuronsValue (values: number[]) {
    
    let hasBiasNeuron = (this.neurons[this.neurons.length -1] instanceof BiasNeuron) ? 1 : 0;
    if (values.length !== (this.neurons.length - hasBiasNeuron)) { //without the bias
      throw new Error(`The size of the input ${values.length} differs fron the number of neurons ${this.neurons.length - hasBiasNeuron}`);
    }
    this.forEachNeuron((n, index) => n.A = values[index]);
    
  }
  
  public linkTo (layer: Layer): ISynapsesLayer {
    
    let synapses = [];
    
    for (let i = 0; i < this.neurons.length; i++) {
      
      let n1 = this.neurons[i]; 
      for (let j = 0; j < layer.neurons.length; j++) {
        
        let n2 = layer.neurons[j],
            s = new Synapse(n1, n2, Math.random() / Math.sqrt(this.neurons.length));
        
        n1.addOutputSynapse(s);
        n2.addInputSynapse(s);
        synapses.push(s);
        
      }
    }
    return synapses;
    
  }
  
  public forEachNeuron (func: (x: Neuron, index?: number) => void) {
    
    for (let i = 0 ; i < this.neurons.length ; i++) {
      func(this.neurons[i], i);
    }
    
  }
  
  public activate (activationFunctions: IActivationFunctions) {
    
    this.forEachNeuron((n) => n.activate(activationFunctions));
    
  }
  
  public computeErrors (costStrategy: CostStrategy) {
    
    this.forEachNeuron((n) => n.computeError(costStrategy));
    
  }
  
  public computeGradients () {
    
    this.forEachNeuron((n) => n.backPropagate());
    
  }
  
}

export class InputLayer extends Layer {
  
  constructor (
    size: number
  ) {
    
    super(size);    
    
    for (let i = 0; i < size; i++) {
      this.neurons.push(new InputNeuron(this, i));    
    } 
    
    this.neurons.push(new BiasNeuron(this, size));
    
  }
  
  public activate () {
    
    throw new Error(`The input layer could not propagate using a previous layer`);
    
  }
  
}


export class HiddenLayer extends Layer {
  
  constructor (
    size: number
  ) {
    
    super(size); 
    
    for (let i = 0; i < size; i++) {
      this.neurons.push(new HiddenNeuron(this, i));    
    } 
       
    this.neurons.push(new BiasNeuron(this, size));
    
  }
  
}

export class OutputLayer extends Layer {
  
  constructor (
    size: number
  ) {
    
    super(size);
    
    for (let i = 0; i < size; i++) {
      this.neurons.push(new OutputNeuron(this, i));    
    } 
        
  }
  
}