

export function zeros (size: number): Array<number> {
  let ret = [];
  
  for (let i = 0; i < size; i++) {
    ret.push(0);
  }
  
  return ret;
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

export function norm (a: Array<number>): number {
  
  let norm = 0;
  
  for (let i = 0; i < a.length ; i++ ) {
    norm += Math.pow(a[i], 2); 
  }
  
  return Math.sqrt(norm);
  
}