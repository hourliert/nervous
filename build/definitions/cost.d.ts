/// <reference path="all.d.ts" />
import { IActivationFunctions } from './neural-network';
export declare enum ECostStrategy {
    Quadratic = 0,
    CrossEntropy = 1,
}
export declare class CostStrategy {
    protected activationFunctions: IActivationFunctions;
    constructor(activationFunctions: IActivationFunctions);
    fn(data: number[], yHat: number[]): number;
    delta(A: number, Z: number): number;
}
export declare class QuadraticCost extends CostStrategy {
    fn(data: number[], yHat: number[]): number;
    delta(A: number, Z: number): number;
}
export declare class CrossEntropyCost extends CostStrategy {
    fn(data: number[], yHat: number[]): number;
    delta(A: number, Z: number): number;
}
