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

let input1 = [
      multiplyByScalar(a, 1/a.length),
      multiplyByScalar(b, 1/b.length),
      multiplyByScalar(c, 1/c.length)  
    ],
    input2 = [
      multiplyByScalar(modifiedC, 1/modifiedC.length)
    ],
    output = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];

let nervous = new NeuralNetwork({
  inputLayerSize: a.length,
  hiddenLayers: [a.length],
  outputLayerSize: 3,
  iterations: 100000,
  learningRate: 0.7,
  log: true
});

console.log('----- PRE TRAINING -----');
console.log('a, b, c', nervous.forward(input1));
console.log('initial cost to a, b, c', nervous.cost(input1, output));

console.log('----- TRAINING -----');
nervous.train(input1, output);

console.log('----- POST TRAINING -----');
console.log('a, b, c', nervous.forward(input1));
console.log('modified c', nervous.forward(input2));
console.log('cost to a, b, c after training', nervous.cost(input1, output));

