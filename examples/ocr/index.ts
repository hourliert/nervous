import {NeuralNetwork, INeuralNetworkConfiguration} from '../../lib/neural-network';
import {multiplyByScalar} from 'nervous-array';

function convertCharacter (character: string): number[] {
  return character.trim().replace(/\r?\n|\r/g, '').split('').map(x => ((x === '#') ? 1 : 0));
}

let a = convertCharacter(`
.#####.
#.....#
#.....#
#######
#.....#
#.....#
#.....#
`);
let b = convertCharacter(`
######.
#.....#
#.....#
######.
#.....#
#.....#
######.
`);
let c = convertCharacter(`
#######
#......
#......
#......
#......
#......
#######
`);

let modifiedC = convertCharacter(`
#######
#......
#......
#......
#......
##.....
#######
`);

let data1 = [
      {
        input: multiplyByScalar(a, 1 / a.length),
        output: [1, 0, 0]
      },
      {
        input: multiplyByScalar(b, 1 / b.length),
        output: [0, 1, 0]
      },
      {
        input: multiplyByScalar(c, 1 / c.length),
        output: [0, 0, 1]
      }
    ],
    data2 = [
      {
        input: multiplyByScalar(modifiedC, 1 / modifiedC.length)
      }
    ]

let nervous = new NeuralNetwork({
  inputLayerSize: a.length,
  hiddenLayers: [a.length],
  outputLayerSize: 3,
  iterations: 100000,
  learningRate: 1,
  batchSize: 3,
  log: true
});

console.log('----- PRE TRAINING -----');
console.log('a, b, c', nervous.forward(data1));
console.log('initial cost to a, b, c', nervous.cost(data1));

console.log('----- TRAINING -----');
nervous.train(data1);

console.log('----- POST TRAINING -----');
console.log('a, b, c', nervous.forward(data1));
console.log('modified c', nervous.forward(data2));
console.log('cost to a, b, c after training', nervous.cost(data1));

