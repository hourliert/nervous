import {Layer, InputLayer, HiddenLayer, OutputLayer} from './layer';
import {sigmoid, sigmoidPrime} from '../utils/sigmoid';


export interface INeuralNetworkConfiguration {
  inputLayerSize: number;
  hiddenLayers?: number[];
  outputLayerSize: number;
  iterations?: number;
  regulation?: number;
  learningRate?: number;
}

export class NeuralNetwork {
  private layers: Layer[];
  private inputLayer: InputLayer;
  private outputLayer: OutputLayer;
  
  constructor (
    private config: INeuralNetworkConfiguration
  ) {
    let activationFunctions = {
      activation: sigmoid,
      activationPrime: sigmoidPrime
    };
    
    this.layers = [];
    
    //layers creation
    this.layers.push(this.inputLayer = new InputLayer(config.inputLayerSize, activationFunctions));
    for (let i = 0 ; i < config.hiddenLayers.length ; i++) {
      this.layers.push(new HiddenLayer(config.hiddenLayers[i], activationFunctions));
    }
    this.layers.push(this.outputLayer = new OutputLayer(config.outputLayerSize, activationFunctions));
    
    //synapses creation
    for (let j = 0 ; j < this.layers.length - 1; j++) {
      this.layers[j].linkTo(this.layers[j + 1]);
    }
    
  }
  
  public forward (input: number[]) {
    //set input to input layer neurons
    this.inputLayer.setNeuronValue(input);
    
    //propagate on each hidden layer and output
    for (let i = 1 ; i < this.layers.length ; i++) {
      this.layers[i].propagate();
    }
    
    //retrieve output neuron value
    console.log('forward result', this.outputLayer);
  }
}

var n = new NeuralNetwork({
  inputLayerSize: 2,
  hiddenLayers: [3],
  outputLayerSize: 1
});

console.log('neural network', n);

n.forward([
  0.1, 0.9
]);