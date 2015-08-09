import {NeuralNetwork, INeuralNetworkConfiguration} from '../../lib/neural-network';
import {multiplyByScalar} from '../../lib/utils/array';

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
      [1.0 / 26.0],
      [2.0 / 26.0],
      [3.0 / 26.0]
    ];

let nervous = new NeuralNetwork({
  inputLayerSize: a.length,
  hiddenLayers: [a.length],
  outputLayerSize: 1,
  iterations: 100000,
  regulation: 0,
  learningRate: 1,
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

