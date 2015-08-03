import {Layer, InputLayer, HiddenLayer, OutputLayer} from './layer';


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
  
  constructor (
    private config: INeuralNetworkConfiguration
  ) {
    
    this.layers = [];
    
    //layers creation
    this.layers.push(new InputLayer(config.inputLayerSize));
    for (let i = 0 ; i < config.hiddenLayers.length ; i++) {
      this.layers.push(new HiddenLayer(config.hiddenLayers[i]));
    }
    this.layers.push(new OutputLayer(config.outputLayerSize));
    
    //synapses creation
    for (let j = 0 ; j < this.layers.length - 1; j++) {
      this.layers[j].linkTo(this.layers[j + 1]);
    }
    
  }
}