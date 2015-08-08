import {Neuron, BiasNeuron} from './neuron';
import {Synapse, ISynapsesLayer} from './synapse';
import {IActivationFunctions} from './neural-network';


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
            s = new Synapse(n1, n2);
        
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
  
  public activate () {
    
    this.forEachNeuron((n) => n.activate());
    
  }
  
  public computeErrors () {
    
    this.forEachNeuron((n) => n.computeError());
    
  }
  
  public computeDeltas () {
    
    this.forEachNeuron((n) => n.backPropagate());
    
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
  
  public activate () {
    
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
  
}