export function sigmoid (z) {
  return 1 / (1 + Math.exp(-z));
}

export function sigmoidPrime(z) {
  return Math.exp(-z) / Math.pow(1 + Math.exp(-z), 2);
}