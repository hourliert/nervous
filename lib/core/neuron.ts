import {Layer, IActivationFunctions} from './layer';
import {Synapse} from './synapse';

export class Neuron {
  public id: string;
  
  private activation: (z: number) => number;
  private activationPrime: (z: number) => number;
  
  private inputSynapse: Synapse[];
  private outputSynapse: Synapse[];
  
  protected value: number;
  protected valuePreActivation: number;
  
  constructor (
    private layer: Layer,
    position: number,
    activationFunctions: IActivationFunctions
  ) {
    
    this.id = `n_${this.layer.id}_${this.layer.id}`;
    this.value = 0;
    this.inputSynapse = [];
    this.outputSynapse = [];
    this.activation = activationFunctions.activation;
    this.activationPrime = activationFunctions.activationPrime;
    
  }
  
  public setInputSynapse (s: Synapse) {
    this.inputSynapse.push(s);
  }
  
  public setOutputSynapse (s: Synapse) {
    this.outputSynapse.push(s);
  }
  
  public setValue (value: number) {
    this.value = value;
  }
  
  public computeValue () {
    
    let sum = 0;
    for (let i = 0 ; i < this.inputSynapse.length ; i++) {
      let s = this.inputSynapse[i];
      sum += s.weight * s.input.value;
    }
    this.valuePreActivation = sum;
    this.value = this.activation(sum);
    
  }
}

export class BiasNeuron extends Neuron {
  
  constructor (
    layer: Layer,
    position: number,
    activationFunctions: IActivationFunctions
  ) {
    super(layer, position, activationFunctions);
    this.value = 1;
  }
  
  public setValue () {
    this.value = 1;
  }
}


