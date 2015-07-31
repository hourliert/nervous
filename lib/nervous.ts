import {sigmoid, sigmoidPrime} from './utils/sigmoid';
import {ConstantMatrix, Matrix} from './utils/matrix';

export interface INervousOptions {
  hiddenLayers?: number
}

export class Nervous {
  public test: Matrix;
  constructor (
    public options?: INervousOptions
  ) {
    
  }
}