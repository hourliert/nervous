import {Layer, IActivationFunctions} from './layer';
import {Synapse} from './synapse';

export class Neuron {
  public id: string;
  
  private activation: (z: number) => number;
  private activationPrime: (z: number) => number;
  
  private inputSynapse: Synapse[];
  private outputSynapse: Synapse[];
  
  public activatedValue: number;
  public preActivatedValue: number;
  public error: number;
  
  constructor (
    private layer: Layer,
    position: number,
    activationFunctions: IActivationFunctions
  ) {
    
    this.id = `n_${this.layer.id}_${this.layer.id}`;
    this.activatedValue = 0;
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
    this.activatedValue = value;
  }
  
  public computeValue () {
    
    let sum = 0;
    for (let i = 0 ; i < this.inputSynapse.length ; i++) {
      let s = this.inputSynapse[i];
      sum += s.weight * s.input.activatedValue;
    }
    this.preActivatedValue = sum;
    this.activatedValue = this.activation(sum);
    
  }
  
  public computeError () {
    
    let delta = 0;
    for (let i = 0 ; i < this.outputSynapse.length ; i++) {
      
      let s = this.outputSynapse[i];   
      delta += s.output.error * s.weight;
      
    }
    this.error = (delta || -this.activatedValue) * this.activationPrime(this.preActivatedValue);
    
  }
  
  public backPropagate () {
    
    for (let i = 0 ; i < this.outputSynapse.length ; i++) {
      let s = this.outputSynapse[i]; 
      s.change += this.activatedValue * s.output.error;
    }
  }
}

export class BiasNeuron extends Neuron {
  
  constructor (
    layer: Layer,
    position: number,
    activationFunctions: IActivationFunctions
  ) {
    super(layer, position, activationFunctions);
    this.activatedValue = 1;
  }
  
  public setValue () {
    this.activatedValue = 1;
  }
}


