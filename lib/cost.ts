/// <reference path="./all.d.ts" />

import {add, sub, multiplyByScalar, multiply, addScalar, sum, zeros, shuffle, rootMeanSquare} from 'nervous-array';
import {ITrainingData} from './neural-network';

import {sigmoid, sigmoidPrime} from 'nervous-sigmoid';

export class CostStrategy {
  static fn (data: ITrainingData, yHats: number[][]): number[] {
    throw new Error(`This method is not implemented`);
  }
  
  static delta (A: number, Z: number): number {
    throw new Error(`This method is not implemented`);
  }
}

export class QuadraticCost extends CostStrategy {
  static fn (data: ITrainingData, yHats: number[][]): number[] {
    let cost = zeros(data[0].output.length);
    
    for (let k = 0; k < data.length; k++) {
      
      //(y-a)^2
      let difference = sub(data[k].output, yHats[k]).map((x) => Math.pow(x, 2));
      cost = add(cost, difference);
      
    }
    
    cost = multiplyByScalar(cost, 0.5);
    
    return cost;
  }
  
  static delta (A: number, Z: number): number {
    return A * sigmoidPrime(Z);
  }
}

export class CrossEntropyCost extends CostStrategy {
  static fn (data: ITrainingData, yHats: number[][]): number[] {
    let cost = zeros(data[0].output.length);
    
    
    for (let k = 0; k < data.length; k++) {
      
      let yOp = data[k].output,
          y1Op = addScalar(multiplyByScalar(data[k].output, -1), 1),
          yHatsLog = yHats[k].slice().map(x => Math.log(x)),
          y1HatsLog = addScalar(multiplyByScalar(yHats[k].slice(), -1), 1).map(x => Math.log(x));

      //-y*log(a)-(1-y)*log(1-a)
      let term1 = multiply(yOp, yHatsLog),
          term2 = multiply(y1Op, y1HatsLog);
      
      let difference = multiplyByScalar(add(term1, term2), -1);
      
      cost = add(cost, difference);
      
    }

    return cost;
  }
  
  static delta (A: number, Z: number): number {
    return A;
  }
}