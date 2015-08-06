export function zeros (size: number): Array<number> {
  let ret = [];
  
  for (let i = 0; i < size; i++) {
    ret.push(0);
  }
  
  return ret;
}

export function sum (a1: Array<number>): number {
  let sum = 0;
  
  for (let i = 0; i < a1.length; i++) {
    sum += a1[i];
  }
  
  return sum; 
}

export function mean (a1: Array<number>): number {
  let mean = 0;
  
  for (let i = 0; i < a1.length; i++) {
    mean += a1[i];
  }
  
  mean = mean / a1.length;
  
  return mean; 
}

export function rootMeanSquare (a1: Array<number>): number {
  let mean = 0;
  
  for (let i = 0; i < a1.length; i++) {
    mean += Math.pow(a1[i], 2);
  }
  
  mean = Math.sqrt(mean);
  
  return mean; 
}

export function add (a1: Array<number>, a2: Array<number>): Array<number> {
  let ret = [];
  
  if (a1.length !== a2.length) {
    throw new Error('The size of the arrays must be the same');
  }
  
  for (let i = 0; i < a1.length; i++) {
    ret[i] = a1[i] + a2[i];
  }
  
  return ret;
}

export function sub (a1: Array<number>, a2: Array<number>): Array<number> {
  let ret = [];
  
  if (a1.length !== a2.length) {
    throw new Error('The size of the arrays must be the same');
  }
  
  for (let i = 0; i < a1.length; i++) {
    ret[i] = a1[i] - a2[i];
  }
  
  return ret;
}

export function multiply (a1: Array<number>, a2: Array<number>): Array<number> {
  let ret = [];
  
  if (a1.length !== a2.length) {
    throw new Error('The size of the arrays must be the same');
  }
  
  for (let i = 0; i < a1.length; i++) {
    ret[i] = a1[i] * a2[i];
  }
  
  return ret;
}

export function multiplyByScalar (a1: Array<number>, scalar: number): Array<number> {
  let ret = [];
  
  for (let i = 0; i < a1.length; i++) {
    ret[i] = a1[i] * scalar;
  }
  
  return ret;
}

export function norm (a: Array<number>): number {
  
  let norm = 0;
  
  for (let i = 0; i < a.length ; i++ ) {
    norm += Math.pow(a[i], 2); 
  }
  
  return Math.sqrt(norm);
  
}