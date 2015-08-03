import {Neuron, BiasNeuron} from './neuron';
import {Synapse} from './synapse';

export interface IActivationFunctions {
  activation: (z: number) => number;
  activationPrime: (z: number) => number;
}

export class Layer {
  static currentId: number = 0;
  
  public id: string;
  protected neurons: Neuron[];
  
  constructor (
    size: number,
    activationFunctions: IActivationFunctions
  ) {
    this.id = `l_${Layer.currentId++}`;
    this.neurons = [];
    
    for (let i = 0; i < size; i++) {
      this.neurons.push(new Neuron(this, i, activationFunctions));    
    }  
      
  }
  
  public linkTo(layer: Layer) {
    for (let i = 0; i < this.neurons.length; i++) {
      let n1 = this.neurons[i];
      
      for (let j = 0; j < layer.neurons.length; j++) {
        let n2 = layer.neurons[j];
        
        let s = new Synapse(n1, n2);
        
        n1.setOutputSynapse(s);
        n2.setInputSynapse(s);
        
      }
      
    }
  }
  
  static linkTo(layer1: Layer, layer2: Layer) {
    for (let i = 0; i < layer1.neurons.length; i++) {
      let n1 = layer1.neurons[i];
      
      for (let j = 0; j < layer2.neurons.length; j++) {
        let n2 = layer2.neurons[j];
        
        let s = new Synapse(n1, n2);
        
        n1.setOutputSynapse(s);
        n2.setInputSynapse(s);
        
      }
      
    }
  }
  
  public propagate () {
    
    for (let i = 0 ; i < this.neurons.length ; i++) {
      this.neurons[i].computeValue();
    }
    
  }
}

export class InputLayer extends Layer {
  constructor (
    size: number,
    activationFunctions: IActivationFunctions
  ) {
    super(size, activationFunctions);    
    this.neurons.push(new BiasNeuron(this, size, activationFunctions));
  }
  
  public setNeuronValue (input: number[]) {
    
    if (input.length !== (this.neurons.length - 1)) { //without the bias
      throw new Error(`The size of the input ${input.length} differs fron the number of neurons ${this.neurons.length - 1}`);
    }
    for (let i = 0 ; i < input.length ; i++) {
      this.neurons[i].setValue(input[i]);
    }
    
  }
  
  public propagate () {
    throw new Error(`The input layer could not propagate using a previous layer`);
  }
}


export class HiddenLayer extends Layer {
  constructor (
    size: number,
    activationFunctions: IActivationFunctions
  ) {
    super(size, activationFunctions);    
    this.neurons.push(new BiasNeuron(this, size, activationFunctions));
  }
}

export class OutputLayer extends Layer {
  constructor (
    size: number,
    activationFunctions: IActivationFunctions
  ) {
    super(size, activationFunctions);    
  }
}