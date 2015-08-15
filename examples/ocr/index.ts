import {NeuralNetwork, INeuralNetworkConfiguration} from '../../lib/neural-network';

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
        input: a,
        output: [1, 0, 0]
      },
      {
        input: b,
        output: [0, 1, 0]
      },
      {
        input: c,
        output: [0, 0, 1]
      }
    ],
    data2 = [
      {
        input: modifiedC
      }
    ];

let nervous = new NeuralNetwork({
  inputLayerSize: a.length,
  hiddenLayers: [10],
  outputLayerSize: 3,
  trainingOptions: {
    regularization: 0.0001,
    iterations: 100000,
    learningRate: 0.5,
    log: true
  }
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

