/// <reference path="./all.d.ts" />

import {add, sub, multiplyByScalar, multiply, addScalar, sum, rootMeanSquare} from 'nervous-array';
import {IActivationFunctions} from './neural-network';

export enum ECostStrategy {Quadratic, CrossEntropy};

export class CostStrategy {
  
  constructor (
    protected activationFunctions: IActivationFunctions  
  ) {
    
  }
  
  fn (data: number[], yHat: number[]): number {
    throw new Error(`This method is not implemented.`);
  }
  
  delta (A: number, Z: number): number {
    throw new Error(`This method is not implemented.`);
  }
}

export class QuadraticCost extends CostStrategy {
  fn (data: number[], yHat: number[]): number {
        
    let cost = Math.pow(rootMeanSquare(sub(yHat, data)), 2);
      
    cost = 0.5 * cost;
    
    return cost;
  }
  
  delta (A: number, Z: number): number {
    return A * this.activationFunctions.activationPrime(Z);
  }
}

export class CrossEntropyCost extends CostStrategy {
  fn (data: number[], yHat: number[]): number {
    let cost = 0;
    
    function nanToNum (x: number): number {
      if (isNaN(x)) {
        return 0;
      }
      return x;
    }
    
    for (let k = 0; k < data.length; k++) {
      
      let yOp = data,
          y1Op = addScalar(multiplyByScalar(data, -1), 1),
          yHatsLog = yHat.slice().map(x => Math.log(x)),
          y1HatsLog = addScalar(multiplyByScalar(yHat.slice(), -1), 1).map(x => Math.log(x));

      let term1 = multiply(yOp, yHatsLog),
          term2 = multiply(y1Op, y1HatsLog);
      
      let difference = multiplyByScalar(add(term1, term2), -1);
      
      difference.map(nanToNum);
      
      //sum(-y*log(a)-(1-y)*log(1-a))
      cost += sum(difference);
      
    }

    return cost;
  }
  
  delta (A: number, Z: number): number {
    return A;
  }
}