export function sigmoid (z: number): number {
  return 1.0 / (1.0 + Math.exp(-z));
}

export function sigmoidPrime(z: number): number {
  return Math.exp(-z) / Math.pow(1.0 + Math.exp(-z), 2);
}