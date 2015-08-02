import {INervousConfiguration, Nervous} from '../../lib/nervous';
import {PlainMatrix} from '../../lib/utils/matrix';

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

let input1 = new PlainMatrix([
      a,
      b,
      c  
    ]),
    input2 = new PlainMatrix([
      modifiedC
    ]),
    output = new PlainMatrix([
      [1.0 / 26.0],
      [2.0 / 26.0],
      [3.0 / 26.0]
    ]);

let nervous = new Nervous({
  inputLayerSize: a.length,
  hiddenLayers: [a.length],
  outputLayerSize: 1,
  iterations: 100000,
  regulation: 0.0001,
  learningRate: 0.7
});

console.log('----- BEFORE TRAINING -----');
console.log('a, b, c', nervous.forward(input1));
console.log('modified c', nervous.forward(input2));
console.log('initial cost to a, b, c', nervous.cost(input1, output));

console.log('----- TRAINING -----');
nervous.train(input1, output);

console.log('----- AFTER TRAINING -----');
console.log('a, b, c', nervous.forward(input1));
console.log('modified c', nervous.forward(input2));
console.log('cost to a, b, c after training', nervous.cost(input1, output));

