export function sigmoid (z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function sigmoidPrime(z: number): number {
  return Math.exp(-z) / Math.pow(1 + Math.exp(-z), 2);
}