import {Layer} from './layer';
import {Synapse} from './synapse';

export class Neuron {
  public id: string;
  
  private inputSynapse: Synapse[];
  private outputSynapse: Synapse[];
  
  protected value: number;
  
  constructor (
    private layer: Layer,
    position: number
  ) {
    
    this.id = `n_${this.layer.id}_${this.layer.id}`;
    this.value = 0;
    this.inputSynapse = [];
    this.outputSynapse = [];
    
  }
  
  public setInputSynapse (s: Synapse) {
    this.inputSynapse.push(s);
  }
  
  public setOutputSynapse (s: Synapse) {
    this.outputSynapse.push(s);
  }
}

export class BiasNeuron extends Neuron {
  private isBias: boolean;
  
  constructor (
    layer: Layer,
    position: number
  ) {
    super(layer, position);
    this.isBias = true;
    this.value = 1;
  }
}


