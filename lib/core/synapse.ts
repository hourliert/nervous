import {Neuron} from './neuron';

export class Synapse {
  public id: string;
  private weight: number;
  
  constructor (
    private input: Neuron,
    private output: Neuron
  ) {
    this.id = `s_${input.id}_${output.id}`;
  }
}