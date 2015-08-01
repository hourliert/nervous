import {sigmoid, sigmoidPrime} from './utils/sigmoid';
import {ConstantMatrix, PlainMatrix, Matrix} from './utils/matrix';

export class Nervous {
  public weights: Matrix[];
  public computed: Matrix[];
  public activated: Matrix[];
  public layer: number;

  constructor(
    private inputLayerSize: number,
    private hiddenLayer: number[],
    private outputLayerSize: number
    ) {
    let k,
      weights: number[][][] = [],
      iterations = this.layer = hiddenLayer.length + 1;

    this.weights = [];
    this.computed = [];
    this.activated = [];

    for (k = 0; k < iterations; k++) {

      let i, j,
        currentSize: number, nextSize:  number;

      if (k === 0) {
        currentSize = inputLayerSize;
        nextSize = hiddenLayer[k];
      } else if (k === iterations - 1) {
        currentSize = hiddenLayer[k - 1];
        nextSize = outputLayerSize;
      } else {
        currentSize = hiddenLayer[k - 1];
        nextSize = hiddenLayer[k];
      }
      for (i = 0; i < currentSize; i++) {
        for (j = 0; j < nextSize; j++) {
          weights[k] = weights[k] || [];
          weights[k][i] = weights[k][i] || [];
          weights[k][i][j] = Math.random() + 0.4 + 0.2;
        }
      }

    }

    for (k = 0; k < weights.length; k++) {
      this.weights[k] = new PlainMatrix(weights[k]);
    }
  }

  public forward(input: Matrix): Matrix {
    let yHat,
      k;
      
    for (k = 0; k < this.weights.length; k++) {
      let currentMatrix: Matrix, nextMatrix: Matrix;

      if (k === 0) {
        currentMatrix = input;
        nextMatrix = this.weights[k];
      } else {
        currentMatrix = this.activated[k - 1];
        nextMatrix = this.weights[k];
      }
      
      this.computed[k] = Matrix.multiply(currentMatrix, nextMatrix);
      this.activated[k] = Matrix.copy(this.computed[k]).map(sigmoid);
      
    }

    return this.activated[k - 1];
  }
  
  public cost (input: Matrix, output: Matrix): number {
    let yHat = this.forward(input),
        i,
        cost = 0,
        difference: Matrix = Matrix.sub(output, yHat);
         
    difference.map((x) => Math.pow(x, 2));
    
    for (i = 0; i < difference.numRows; i++) {
      cost += difference[i][0];
    }
    
    cost = 0.5 * cost;
    return cost;
  }
  
  public costPrime(input: Matrix, output: Matrix): Matrix[] {
    let yHat = this.forward(input),
        difference = Matrix.sub(yHat, output),
        i,
        changes: Matrix[] = [],
        deltas: Matrix[] = [];
        
    for (i = this.weights.length - 1; i >= 0; i--) {
      
      let currentMatrix: Matrix, nextMatrix: Matrix;
      if (i === this.weights.length - 1) {
        
        deltas[i] = Matrix.multiplyElement(
          difference, 
          Matrix.copy(this.computed[i]).map(sigmoidPrime)
        );
        changes[i] = Matrix.multiply(Matrix.transpose(this.activated[i - 1]), deltas[i]);    
        
      } else if (i === 0) {
      
        deltas[i] = Matrix.multiply(
          deltas[i + 1],          
          Matrix.transpose(this.weights[i + 1])
        );
        deltas[i].multiplyElement(Matrix.copy(this.computed[i]).map(sigmoidPrime));
        changes[i] = Matrix.multiply(Matrix.transpose(input), deltas[i]); 
        
      } else {
        
        deltas[i] = Matrix.multiply(
          deltas[i + 1],
          Matrix.transpose(this.weights[i + 1])
        );
        deltas[i].multiplyElement(Matrix.copy(this.computed[i]).map(sigmoidPrime));
        changes[i] = Matrix.multiply(Matrix.transpose(this.activated[i - 1]), deltas[i]);    
        
      }
      
    }
    
    return changes;
    
  }
}