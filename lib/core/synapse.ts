import {Neuron} from './neuron';

export class Synapse {
  public id: string;
  public weight: number;
  
  constructor (
    public input: Neuron,
    public output: Neuron
  ) {
    this.id = `s_${input.id}_${output.id}`;
    this.weight = Math.random();
  }
}