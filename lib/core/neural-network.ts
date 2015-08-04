import {Layer, InputLayer, HiddenLayer, OutputLayer, ISynapsesLayer} from './layer';
import {Synapse} from './synapse';
import {sigmoid, sigmoidPrime} from '../utils/sigmoid';
import {add, sub, zeros, norm} from '../utils/array';


export interface INeuralNetworkConfiguration {
  inputLayerSize: number;
  hiddenLayers?: number[];
  outputLayerSize: number;
  iterations?: number;
  regulation?: number;
  learningRate?: number;
}

export interface IInputPattern extends Array<number> {}
export interface IOutputPattern extends Array<number> {}

export class NeuralNetwork {
  private neuronsLayers: Layer[];
  private synapsesLayers: ISynapsesLayer[];
  private inputLayer: InputLayer;
  private outputLayer: OutputLayer;
  
  constructor (
    private config: INeuralNetworkConfiguration
  ) {
    let activationFunctions = {
      activation: sigmoid,
      activationPrime: sigmoidPrime
    };
    
    this.neuronsLayers = [];
    this.synapsesLayers = [];
    
    //layers creation
    this.neuronsLayers.push(this.inputLayer = new InputLayer(config.inputLayerSize, activationFunctions));
    for (let i = 0 ; i < config.hiddenLayers.length ; i++) {
      this.neuronsLayers.push(new HiddenLayer(config.hiddenLayers[i], activationFunctions));
    }
    this.neuronsLayers.push(this.outputLayer = new OutputLayer(config.outputLayerSize, activationFunctions));
    
    //synapses creation
    for (let j = 0 ; j < this.neuronsLayers.length - 1; j++) {
      let synapses = this.neuronsLayers[j].linkTo(this.neuronsLayers[j + 1]);
      this.synapsesLayers.push(synapses);
    }
    
  }
  
  public forward (inputs: IInputPattern[]): IOutputPattern[] {
    
    let ret = [];
    
    for (let k = 0 ; k < inputs.length ; k ++ ) {
      //set input to input layer neurons
      this.inputLayer.setNeuronValue(inputs[k]);
      
      //propagate on each hidden layer and output
      for (let i = 1 ; i < this.neuronsLayers.length ; i++) {
        this.neuronsLayers[i].propagate();
      }
      
      //retrieve output neuron value
      ret.push(this.outputLayer.value);
    }
    return ret;
  }
  
  public cost (inputs: IInputPattern[], outputs: IOutputPattern[]): number {
    
    if (inputs.length !== outputs.length) {
      throw new Error(`Input and output must have the same number of value`);
    }
    
    let j = 0,
        yHats = this.forward(inputs);
    
    for (let k = 0; k < inputs.length; k++) {
      let difference = sub(outputs[k], yHats[k]).map((x) => Math.pow(x, 2));

      for (let l = 0; l < difference.length ; l++) {
        j += difference[l];
      }
    }
    
    j = 0.5 * j;        
    
    return j;
  }
  
  public backward (inputs: IInputPattern[], outputs: IOutputPattern[]): ISynapsesLayer[] {
    if (inputs.length !== outputs.length) {
      throw new Error(`Input and output must have the same number of value`);
    }
    
    let ret = [];
    
    for (let k = 0 ; k < inputs.length ; k ++ ) {
      let input = inputs[k],
          output = outputs[k],
          yHat = this.forward([input])[0];
          
      //set the input and output layer value
      this.inputLayer.setNeuronValue(input);
      this.outputLayer.setNeuronValue(sub(output, yHat));
          
      //compute propagation errors for all layers expect input
      for (let i = this.neuronsLayers.length - 1 ; i >= 1 ; i--) {
        this.neuronsLayers[i].computeError();
      }
      
      //compute dJdW for all synapses layer
      for (let i = 0 ; i < this.neuronsLayers.length  ; i++) {
        this.neuronsLayers[i].backPropagate();
      }
      
      
    }
    
    return this.synapsesLayers;
    
  }
  
  public adjustWeigths (synapses: ISynapsesLayer[]) {
    
    if (synapses.length !== this.synapsesLayers.length) {
      throw new Error(`The number of synapses layers differs.`);
    }
    for (let i = 0; i < synapses.length ; i++) {
      if (synapses[i].length !== this.synapsesLayers[i].length) {
        throw new Error(`The number of synapses in the ${i} layer differs`);
      }
    } 
    
    for (let i = 0; i < synapses.length ; i++) {
      for (let j = 0; j < synapses[i].length ; j++) {
        let s = synapses[i][j];
        s.weight -= s.change;
        s.change = 0;      
      } 
    } 
  }
  
  public getGradients (inputs, outputs): number[] {
    let gradients = [],
        synapses = this.backward(inputs, outputs);
    
    for (let i = 0; i < synapses.length ; i++) {
      for (let j = 0; j < synapses[i].length ; j++) {
        let s = synapses[i][j];
        gradients.push(s.change);
        s.change = 0;      
      } 
    } 
    
    return gradients;
  }
    
  get weights (): number[] {
    let weights = [];
    for (let i = 0; i < this.synapsesLayers.length ; i++) {
      for (let j = 0; j < this.synapsesLayers[i].length ; j++) {
        let s = this.synapsesLayers[i][j];
        weights.push(s.weight);     
      } 
    } 
    return weights;
  } 
  
  set weights (synapses: number[]) {
    let cpt = 0;
    
    for (let i = 0; i < this.synapsesLayers.length ; i++) {
      for (let j = 0; j < this.synapsesLayers[i].length ; j++) {
        this.synapsesLayers[i][j].weight = synapses[cpt++];      
      } 
    } 
  }
}

export function computeNumericalGradients (n: NeuralNetwork, input: IInputPattern[], output: IOutputPattern[]) {
  
  let epsilon = 1e-4,
      initialWeights: number[] = n.weights,
      numGrads = initialWeights.length,
      gradients: number[] = zeros(numGrads),
      perturb: Array<number> = zeros(numGrads),
      k;
      
  for (k = 0; k < numGrads; k++) {
    
    let loss1, loss2;
    
    perturb[k] = epsilon;
    n.weights = add(initialWeights, perturb);
    loss2 = n.cost(input, output);
    
    n.weights = sub(initialWeights, perturb);
    loss1 = n.cost(input, output)

    gradients[k] = (loss2 - loss1) / (2 * epsilon);

    perturb[k] = 0;
    
  }
  
  n.weights = initialWeights;
  
  return gradients;
  
}

var n = new NeuralNetwork({
  inputLayerSize: 2,
  hiddenLayers: [3],
  outputLayerSize: 1
});

console.log('----- Neural Network -----');
console.log(n);

let input = [
  [3.0 / 10.0, 5.0 / 10.0],
  [5.0 / 10.0, 1.0 / 10.0],
  [10.0 / 10.0, 2.0 / 10.0]
], output = [
  [75.0 / 100.0],
  [82.0 / 100.0],
  [93.0 / 100.0]
];

let gradients = n.getGradients(input, output),
    numGradients = computeNumericalGradients(n, input, output),
    normResult = norm(sub(gradients, numGradients)) / norm(add(gradients, numGradients));
    
console.log('----- Gradient comparaison -----');
console.info(normResult);


console.info('----- PRE TRAINING -----');
console.log(n.forward(input));
console.log(n.cost(input, output));

let iterations = 1000000;

for (let i = 0; i < iterations ; i++) {
  if (i % (iterations/100) === 0) {
    let cost = n.cost(input, output);
    console.info(`Progress ${i / iterations}, cost: ${cost}`);
  }  
  
  let synapsesLayers, forward;
  forward = n.forward(input);
  synapsesLayers = n.backward(input, output);
  n.adjustWeigths(synapsesLayers);
}

console.info('----- POST TRAINING -----');
console.log(n.forward(input));
console.log(n.cost(input, output));