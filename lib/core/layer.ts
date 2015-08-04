import {Neuron, BiasNeuron} from './neuron';
import {Synapse} from './synapse';

export interface ISynapsesLayer extends Array<Synapse> {}

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
  
  public linkTo(layer: Layer): ISynapsesLayer {
    let synapses = [];
    
    for (let i = 0; i < this.neurons.length; i++) {
      let n1 = this.neurons[i];
      
      for (let j = 0; j < layer.neurons.length; j++) {
        let n2 = layer.neurons[j];
        
        let s = new Synapse(n1, n2);
        
        n1.setOutputSynapse(s);
        n2.setInputSynapse(s);
        
        synapses.push(s);
        
      }
    }
    return synapses;
    
  }
  
  public propagate () {
    
    for (let i = 0 ; i < this.neurons.length ; i++) {
      this.neurons[i].computeValue();
    }
    
  }
  
  public computeError () {
    
    for (let i = 0 ; i < this.neurons.length ; i++) {
      this.neurons[i].computeError();
    }
    
  }
  
  public backPropagate () {
    
    for (let i = 0 ; i < this.neurons.length ; i++) {
      this.neurons[i].backPropagate();
    }
    
  }
 
  
  public setNeuronValue (input: number[]) {
    
    if (input.length !== this.neurons.length) {
      throw new Error(`The size of the input ${input.length} differs fron the number of neurons ${this.neurons.length}`);
    }
    for (let i = 0 ; i < input.length ; i++) {
      this.neurons[i].setValue(input[i]);
    }
  }
  

}

export class InputLayer extends Layer {
  constructor (
    size: number,
    activationFunctions: IActivationFunctions
  ) {
    super(size, activationFunctions);    
    // this.neurons.push(new BiasNeuron(this, size, activationFunctions));
  }
  
  public setNeuronValue (input: number[]) {
    
    if (input.length !== (this.neurons.length)) { //without the bias
      throw new Error(`The size of the input ${input.length} differs fron the number of neurons ${this.neurons.length}`);
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
    // this.neurons.push(new BiasNeuron(this, size, activationFunctions));
  }
}

export class OutputLayer extends Layer {
  constructor (
    size: number,
    activationFunctions: IActivationFunctions
  ) {
    super(size, activationFunctions);    
  }
  
  get value(): number[] {
    let ret = [];
    for (let i = 0 ; i < this.neurons.length ; i++) {
      ret.push(this.neurons[i].activatedValue);
    }
    return ret;
  }
}