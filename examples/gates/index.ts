import {NeuralNetwork, INeuralNetworkConfiguration, ITrainingData} from '../../lib/neural-network';

function log(message) {
  console.log(`----------${message}----------`);
}

let dataAnd: ITrainingData = [
      {
        input: [
          0,
          0
        ],
        output: [
          0
        ]
      },
      {
        input: [
          0,
          1
        ],
        output: [
          0
        ]
      },
      {
        input: [
          1,
          0
        ],
        output: [
          0
        ]
      },
      {
        input: [
          1,
          1
        ],
        output: [
          1
        ]
      }
    ],
  dataOr: ITrainingData = [
      {
        input: [
          0,
          0
        ],
        output: [
          0
        ]
      },
      {
        input: [
          0,
          1
        ],
        output: [
          1
        ]
      },
      {
        input: [
          1,
          0
        ],
        output: [
          1
        ]
      },
      {
        input: [
          1,
          1
        ],
        output: [
          1
        ]
      }
    ],
  dataNot: ITrainingData = [
    {
      input: [
        0
      ],
      output: [
        1
      ]
    },
    {
      input: [
        1
      ],
      output: [
        0
      ]
    }
  ];
      
let andGate = new NeuralNetwork({
    inputLayerSize: 2,
    hiddenLayers: [3],
    outputLayerSize: 1,
    trainingOptions: {
      iterations: 100000,
      learningRate: 0.1,
      log: true
    }
  }),
  orGate = new NeuralNetwork({
    inputLayerSize: 2,
    hiddenLayers: [3],
    outputLayerSize: 1,
    trainingOptions: {
      iterations: 100000,
      learningRate: 0.1,
      log: true
    }
  }),
  notGate = new NeuralNetwork({
    inputLayerSize: 1,
    hiddenLayers: [2],
    outputLayerSize: 1,
    trainingOptions: {
      iterations: 100000,
      learningRate: 0.1,
      log: true
    }
  });

log('Training');
log('Training AND');
andGate.train(dataAnd);
log('Training OR');
orGate.train(dataOr);
log('Training NOT');
notGate.train(dataNot);

log('Forward AND');
log(andGate.forward(dataAnd));

log('Forward OR');
log(orGate.forward(dataOr));

log('Forward NOT');
log(notGate.forward(dataNot));