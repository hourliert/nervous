import {sigmoid, sigmoidPrime} from './utils/sigmoid';
import {ConstantMatrix, PlainMatrix, Matrix} from './utils/matrix';

export class Nervous {
  public weights: Matrix[];
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
          weights[k][i][j] = Math.random();
        }
      }

    }

    for (k = 0; k < weights.length; k++) {
      this.weights[k] = new PlainMatrix(weights[k]);
    }
  }

  public forward(input: Matrix): Matrix {
    let yHat,
      k,
      Z: Matrix[] = [],
      A: Matrix[] = [];

    for (k = 0; k < this.weights.length; k++) {
      let currentMatrix: Matrix, nextMatrix: Matrix;

      if (k === 0) {
        currentMatrix = input;
        nextMatrix = this.weights[k];
      } else {
        currentMatrix = A[k - 1];
        nextMatrix = this.weights[k];
      }
      
      Z[k] = Matrix.multiply(currentMatrix, nextMatrix);
      A[k] = Matrix.copy(Z[k]).map(sigmoid);
      
    }

    return A[k - 1];
  }

}