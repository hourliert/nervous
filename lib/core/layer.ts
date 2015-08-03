import {Neuron, BiasNeuron} from './neuron';
import {Synapse} from './synapse';

export class Layer {
  static currentId: number = 0;
  
  public id: string;
  protected neurons: Neuron[];
  
  constructor (
    size: number
  ) {
    this.id = `l_${Layer.currentId++}`;
    this.neurons = [];
    
    for (let i = 0; i < size; i++) {
      this.neurons.push(new Neuron(this, i));    
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
}

export class InputLayer extends Layer {
  constructor (
    size: number
  ) {
    super(size);    
    this.neurons.push(new BiasNeuron(this, size));
  }
}


export class HiddenLayer extends Layer {
  constructor (
    size: number
  ) {
    super(size);    
    this.neurons.push(new BiasNeuron(this, size));
  }
}

export class OutputLayer extends Layer {
  constructor (
    size: number
  ) {
    super(size);    
  }
}