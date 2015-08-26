/// <reference path="./all.d.ts" />
var nervous_array_1 = require('nervous-array');
var nervous_sigmoid_1 = require('nervous-sigmoid');
var layer_1 = require('./layer');
var cost_1 = require('./cost');
require('./polyfills/assign');
var NeuralNetwork = (function () {
    function NeuralNetwork(config) {
        this.config = config;
        this.config.hiddenLayers = this.config.hiddenLayers || [this.config.inputLayerSize];
        this.config.trainingOptions = this.config.trainingOptions || {};
        this.config.trainingOptions.iterations = this.config.trainingOptions.iterations || 10000;
        this.config.trainingOptions.batchSize = this.config.trainingOptions.batchSize || 10;
        this.config.trainingOptions.regularization = (this.config.trainingOptions.regularization === undefined) ? 0.0001 : this.config.trainingOptions.regularization;
        this.config.trainingOptions.learningRate = (this.config.trainingOptions.learningRate === undefined) ? 0.5 : this.config.trainingOptions.learningRate;
        this.activationFunctions = {
            activation: nervous_sigmoid_1.sigmoid,
            activationPrime: nervous_sigmoid_1.sigmoidPrime
        };
        switch (this.config.costStrategy) {
            case cost_1.ECostStrategy.Quadratic:
            default:
                this.costStrategy = new cost_1.QuadraticCost(this.activationFunctions);
                break;
            case cost_1.ECostStrategy.CrossEntropy:
                this.costStrategy = new cost_1.CrossEntropyCost(this.activationFunctions);
                break;
        }
        this.neuronsLayers = [];
        this.synapsesLayers = [];
        this.numberOfSynapses = 0;
        //layers creation
        this.neuronsLayers.push(this.inputLayer = new layer_1.InputLayer(config.inputLayerSize));
        for (var i = 0; i < config.hiddenLayers.length; i++) {
            this.neuronsLayers.push(new layer_1.HiddenLayer(config.hiddenLayers[i]));
        }
        this.neuronsLayers.push(this.outputLayer = new layer_1.OutputLayer(config.outputLayerSize));
        //synapses creation
        for (var j = 0; j < this.neuronsLayers.length - 1; j++) {
            var synapses = this.neuronsLayers[j].linkTo(this.neuronsLayers[j + 1]);
            this.synapsesLayers.push(synapses);
            this.numberOfSynapses += synapses.length;
        }
    }
    Object.defineProperty(NeuralNetwork.prototype, "weights", {
        get: function () {
            var weights = [];
            this.forEachSynapse(function (s) {
                weights.push(s.weight);
            });
            return weights;
        },
        set: function (synapses) {
            if (synapses.length !== this.numberOfSynapses) {
                throw new Error("The number of synapses differs.");
            }
            var cpt = 0;
            this.forEachSynapse(function (s) {
                s.weight = synapses[cpt++];
            });
        },
        enumerable: true,
        configurable: true
    });
    NeuralNetwork.prototype.getGradients = function (data) {
        var gradients = [];
        this.backward(data);
        this.forEachSynapse(function (s) {
            gradients.push(s.gradient);
        });
        return gradients;
    };
    NeuralNetwork.prototype.forEachSynapse = function (func) {
        for (var i = 0; i < this.synapsesLayers.length; i++) {
            for (var j = 0; j < this.synapsesLayers[i].length; j++) {
                func(this.synapsesLayers[i][j], i, j);
            }
        }
    };
    NeuralNetwork.prototype.forward = function (data) {
        var ret = [];
        for (var k = 0; k < data.length; k++) {
            //set input to input layer neurons
            this.inputLayer.neuronsValue = data[k].input;
            //propagate on each hidden layer and output
            for (var i = 1; i < this.neuronsLayers.length; i++) {
                this.neuronsLayers[i].activate(this.activationFunctions);
            }
            //retrieve output neuron value
            ret.push(this.outputLayer.neuronsValue);
        }
        return ret;
    };
    NeuralNetwork.prototype.cost = function (data) {
        var yHats = this.forward(data), j = 0, weightsSum = 0;
        for (var k = 0; k < data.length; k++) {
            j += this.costStrategy.fn(data[k].output, yHats[k]);
        }
        j = j / data.length;
        this.forEachSynapse(function (s) {
            weightsSum += Math.pow(s.weight, 2);
        });
        j += this.config.trainingOptions.regularization / (2 * data.length) * weightsSum;
        return j;
    };
    NeuralNetwork.prototype.backward = function (data) {
        var ret = [];
        for (var k = 0; k < data.length; k++) {
            var tuple = data[k], yHat = this.forward([tuple])[0];
            //set the input and output layer value
            this.inputLayer.neuronsValue = tuple.input;
            this.outputLayer.neuronsValue = nervous_array_1.sub(yHat, tuple.output);
            //compute propagation errors for all layers expect input
            for (var i = this.neuronsLayers.length - 1; i >= 1; i--) {
                this.neuronsLayers[i].computeErrors(this.costStrategy);
            }
            //compute dJdW for all synapses layer
            for (var i = 0; i < this.neuronsLayers.length; i++) {
                this.neuronsLayers[i].computeGradients();
            }
        }
        return this.synapsesLayers;
    };
    NeuralNetwork.prototype.adjustWeights = function (synapses, batchSize, dataSize) {
        var _this = this;
        if (synapses.length !== this.synapsesLayers.length) {
            throw new Error("The number of synapses layers differs.");
        }
        for (var i = 0; i < synapses.length; i++) {
            if (synapses[i].length !== this.synapsesLayers[i].length) {
                throw new Error("The number of synapses in the " + i + " layer differs");
            }
        }
        this.forEachSynapse(function (s) {
            s.weight = (1 - _this.config.trainingOptions.learningRate * _this.config.trainingOptions.regularization / dataSize) * s.weight - _this.config.trainingOptions.learningRate / batchSize * s.gradient;
            s.gradient = 0;
        });
    };
    NeuralNetwork.prototype.train = function (data, options) {
        Object.assign(this.config.trainingOptions, options);
        var iterations = this.config.trainingOptions.iterations, batchSize = this.config.trainingOptions.batchSize = (this.config.trainingOptions.batchSize > data.length) ? data.length : this.config.trainingOptions.batchSize;
        for (var i = 0; i < iterations; i++) {
            if (batchSize && batchSize !== data.length) {
                nervous_array_1.shuffle(data);
            }
            var batch = data.slice(0, batchSize), synapses = this.backward(batch);
            this.adjustWeights(synapses, batchSize, data.length);
            if (this.config.trainingOptions.log && (i % (iterations / 100) === 0)) {
                console.info("Progress " + i / iterations + ", cost: " + this.cost(data));
            }
        }
        return {
            error: this.cost(data)
        };
    };
    return NeuralNetwork;
})();
exports.NeuralNetwork = NeuralNetwork;
function computeNumericalGradients(n, data) {
    var epsilon = 1e-4, initialWeights = n.weights, numGrads = initialWeights.length, gradients = nervous_array_1.zeros(numGrads), perturb = nervous_array_1.zeros(numGrads), k;
    for (k = 0; k < numGrads; k++) {
        var loss1 = void 0, loss2 = void 0;
        perturb[k] = epsilon;
        n.weights = nervous_array_1.add(initialWeights, perturb);
        loss2 = n.cost(data);
        n.weights = nervous_array_1.sub(initialWeights, perturb);
        loss1 = n.cost(data);
        gradients[k] = data.length * nervous_array_1.sum(nervous_array_1.multiplyByScalar(nervous_array_1.sub([loss2], [loss1]), 1 / (epsilon * 2)));
        perturb[k] = 0;
    }
    n.weights = initialWeights;
    return gradients;
}
exports.computeNumericalGradients = computeNumericalGradients;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLnRzIl0sIm5hbWVzIjpbIk5ldXJhbE5ldHdvcmsiLCJOZXVyYWxOZXR3b3JrLmNvbnN0cnVjdG9yIiwiTmV1cmFsTmV0d29yay53ZWlnaHRzIiwiTmV1cmFsTmV0d29yay5nZXRHcmFkaWVudHMiLCJOZXVyYWxOZXR3b3JrLmZvckVhY2hTeW5hcHNlIiwiTmV1cmFsTmV0d29yay5mb3J3YXJkIiwiTmV1cmFsTmV0d29yay5jb3N0IiwiTmV1cmFsTmV0d29yay5iYWNrd2FyZCIsIk5ldXJhbE5ldHdvcmsuYWRqdXN0V2VpZ2h0cyIsIk5ldXJhbE5ldHdvcmsudHJhaW4iLCJjb21wdXRlTnVtZXJpY2FsR3JhZGllbnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxtQ0FBbUM7QUFFbkMsOEJBQXlGLGVBQWUsQ0FBQyxDQUFBO0FBQ3pHLGdDQUFvQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRXRELHNCQUEwRCxTQUFTLENBQUMsQ0FBQTtBQUVwRSxxQkFBMkUsUUFBUSxDQUFDLENBQUE7QUFFcEYsUUFBTyxvQkFBb0IsQ0FBQyxDQUFBO0FBZ0M1QjtJQVdFQSx1QkFDVUEsTUFBbUNBO1FBQW5DQyxXQUFNQSxHQUFOQSxNQUFNQSxDQUE2QkE7UUFHM0NBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFlBQVlBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO1FBRXBGQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxJQUFJQSxFQUFFQSxDQUFDQTtRQUNoRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsVUFBVUEsSUFBSUEsS0FBS0EsQ0FBQ0E7UUFDekZBLElB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QUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUVwS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBR0EsQ0FBQ0EsR0FBR0EsVUFBVUEsRUFBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFFdENBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLElBQUlBLFNBQVNBLEtBQUtBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO2dCQUMzQ0EsdUJBQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ2hCQSxDQUFDQTtZQUVEQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxTQUFTQSxDQUFDQSxFQUNoQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFFcENBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFFBQVFBLEVBQUVBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBRXJEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFVQSxHQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcEVBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLGNBQVlBLENBQUNBLEdBQUdBLFVBQVVBLGdCQUFXQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFHQSxDQUFDQSxDQUFDQTtZQUN2RUEsQ0FBQ0E7UUFFSEEsQ0FBQ0E7UUFDREEsTUFBTUEsQ0FBQ0E7WUFDTEEsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7U0FDdkJBLENBQUNBO0lBRUpBLENBQUNBO0lBRUhULG9CQUFDQTtBQUFEQSxDQTVOQSxBQTROQ0EsSUFBQTtBQTVOWSxxQkFBYSxnQkE0TnpCLENBQUE7QUFFRCxtQ0FBMkMsQ0FBZ0IsRUFBRSxJQUFtQjtJQUU5RVUsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsRUFDZEEsY0FBY0EsR0FBYUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsRUFDcENBLFFBQVFBLEdBQUdBLGNBQWNBLENBQUNBLE1BQU1BLEVBQ2hDQSxTQUFTQSxHQUFhQSxxQkFBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsRUFDckNBLE9BQU9BLEdBQWtCQSxxQkFBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsRUFDeENBLENBQUNBLENBQUNBO0lBRU5BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1FBRTlCQSxJQUFJQSxLQUFLQSxTQUFBQSxFQUFFQSxLQUFLQSxTQUFBQSxDQUFDQTtRQUVqQkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDckJBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLG1CQUFHQSxDQUFDQSxjQUFjQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUN6Q0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDckJBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLG1CQUFHQSxDQUFDQSxjQUFjQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUN6Q0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQUE7UUFDcEJBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLG1CQUFHQSxDQUFDQSxnQ0FBZ0JBLENBQUNBLG1CQUFHQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM3RkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFFakJBLENBQUNBO0lBQ0RBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLGNBQWNBLENBQUNBO0lBQzNCQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtBQUVuQkEsQ0FBQ0E7QUF6QmUsaUNBQXlCLDRCQXlCeEMsQ0FBQSIsImZpbGUiOiJuZXVyYWwtbmV0d29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2FsbC5kLnRzXCIgLz5cblxuaW1wb3J0IHthZGQsIHN1YiwgbXVsdGlwbHlCeVNjYWxhciwgYWRkU2NhbGFyLCBzdW0sIHplcm9zLCBzaHVmZmxlLCByb290TWVhblNxdWFyZX0gZnJvbSAnbmVydm91cy1hcnJheSc7XG5pbXBvcnQge3NpZ21vaWQsIHNpZ21vaWRQcmltZX0gZnJvbSAnbmVydm91cy1zaWdtb2lkJztcblxuaW1wb3J0IHtMYXllciwgSW5wdXRMYXllciwgSGlkZGVuTGF5ZXIsIE91dHB1dExheWVyfSBmcm9tICcuL2xheWVyJztcbmltcG9ydCB7U3luYXBzZSwgSVN5bmFwc2VzTGF5ZXJ9IGZyb20gJy4vc3luYXBzZSc7XG5pbXBvcnQge0Nvc3RTdHJhdGVneSwgRUNvc3RTdHJhdGVneSwgUXVhZHJhdGljQ29zdCwgQ3Jvc3NFbnRyb3B5Q29zdH0gZnJvbSAnLi9jb3N0JztcblxuaW1wb3J0ICcuL3BvbHlmaWxscy9hc3NpZ24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIElBY3RpdmF0aW9uRnVuY3Rpb25zIHtcbiAgYWN0aXZhdGlvbjogKHo6IG51bWJlcikgPT4gbnVtYmVyO1xuICBhY3RpdmF0aW9uUHJpbWU6ICh6OiBudW1iZXIpID0+IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVHJhaW5pbmdDb25maWd1cmF0aW9uIHtcbiAgcmVndWxhcml6YXRpb24/OiBudW1iZXI7XG4gIGJhdGNoU2l6ZT86IG51bWJlcjtcbiAgbGVhcm5pbmdSYXRlPzogbnVtYmVyO1xuICBpdGVyYXRpb25zPzogbnVtYmVyO1xuICBsb2c/OiBib29sZWFuO1xufVxuZXhwb3J0IGludGVyZmFjZSBJTmV1cmFsTmV0d29ya0NvbmZpZ3VyYXRpb24ge1xuICBpbnB1dExheWVyU2l6ZTogbnVtYmVyO1xuICBoaWRkZW5MYXllcnM/OiBudW1iZXJbXTtcbiAgb3V0cHV0TGF5ZXJTaXplOiBudW1iZXI7XG4gIHRyYWluaW5nT3B0aW9ucz86IElUcmFpbmluZ0NvbmZpZ3VyYXRpb247XG4gIGNvc3RTdHJhdGVneT86IEVDb3N0U3RyYXRlZ3k7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVR1cGxlIHtcbiAgaW5wdXQ6IEFycmF5PG51bWJlcj47XG4gIG91dHB1dD86IEFycmF5PG51bWJlcj47IFxufVxuZXhwb3J0IGludGVyZmFjZSBJVHJhaW5pbmdEYXRhIGV4dGVuZHMgQXJyYXk8SVR1cGxlPiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIElUcmFpbmluZ091dHB1dCB7XG4gIGVycm9yOiBudW1iZXJcbn1cblxuZXhwb3J0IGNsYXNzIE5ldXJhbE5ldHdvcmsge1xuICBcbiAgcHJpdmF0ZSBuZXVyb25zTGF5ZXJzOiBMYXllcltdO1xuICBwcml2YXRlIHN5bmFwc2VzTGF5ZXJzOiBJU3luYXBzZXNMYXllcltdO1xuICBwcml2YXRlIG51bWJlck9mU3luYXBzZXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBpbnB1dExheWVyOiBJbnB1dExheWVyO1xuICBwcml2YXRlIG91dHB1dExheWVyOiBPdXRwdXRMYXllcjtcbiAgXG4gIHByaXZhdGUgYWN0aXZhdGlvbkZ1bmN0aW9uczogSUFjdGl2YXRpb25GdW5jdGlvbnM7XG4gIHByaXZhdGUgY29zdFN0cmF0ZWd5OiBDb3N0U3RyYXRlZ3k7XG5cbiAgY29uc3RydWN0b3IgKFxuICAgIHByaXZhdGUgY29uZmlnOiBJTmV1cmFsTmV0d29ya0NvbmZpZ3VyYXRpb25cbiAgKSB7XG4gICAgXG4gICAgdGhpcy5jb25maWcuaGlkZGVuTGF5ZXJzID0gdGhpcy5jb25maWcuaGlkZGVuTGF5ZXJzIHx8IFt0aGlzLmNvbmZpZy5pbnB1dExheWVyU2l6ZV07XG4gICAgXG4gICAgdGhpcy5jb25maWcudHJhaW5pbmdPcHRpb25zID0gdGhpcy5jb25maWcudHJhaW5pbmdPcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuY29uZmlnLnRyYWluaW5nT3B0aW9ucy5pdGVyYXRpb25zID0gdGhpcy5jb25maWcudHJhaW5pbmdPcHRpb25zLml0ZXJhdGlvbnMgfHwgMTAwMDA7XG4gICAgdGhpcy5jb25maWcudHJhaW5pbmdPcHRpb25zLmJhdGNoU2l6ZSA9IHRoaXMuY29uZmlnLnRyYWluaW5nT3B0aW9ucy5iYXRjaFNpemUgfHwgMTA7XG4gICAgdGhpcy5jb25maWcudHJhaW5pbmdPcHRpb25zLnJlZ3VsYXJpemF0aW9uID0gKHRoaXMuY29uZmlnLnRyYWluaW5nT3B0aW9ucy5yZWd1bGFyaXphdGlvbiA9PT0gdW5kZWZpbmVkKSA/IDAuMDAwMSA6IHRoaXMuY29uZmlnLnRyYWluaW5nT3B0aW9ucy5yZWd1bGFyaXphdGlvbjtcbiAgICB0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMubGVhcm5pbmdSYXRlID0gKHRoaXMuY29uZmlnLnRyYWluaW5nT3B0aW9ucy5sZWFybmluZ1JhdGUgPT09IHVuZGVmaW5lZCkgPyAwLjUgOiB0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMubGVhcm5pbmdSYXRlO1xuICAgIFxuICAgIHRoaXMuYWN0aXZhdGlvbkZ1bmN0aW9ucyA9IHtcbiAgICAgIGFjdGl2YXRpb246IHNpZ21vaWQsXG4gICAgICBhY3RpdmF0aW9uUHJpbWU6IHNpZ21vaWRQcmltZVxuICAgIH07XG4gICAgXG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy5jb3N0U3RyYXRlZ3kpIHtcbiAgICAgIGNhc2UgRUNvc3RTdHJhdGVneS5RdWFkcmF0aWM6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmNvc3RTdHJhdGVneSA9IG5ldyBRdWFkcmF0aWNDb3N0KHRoaXMuYWN0aXZhdGlvbkZ1bmN0aW9ucyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFQ29zdFN0cmF0ZWd5LkNyb3NzRW50cm9weTpcbiAgICAgICAgdGhpcy5jb3N0U3RyYXRlZ3kgPSBuZXcgQ3Jvc3NFbnRyb3B5Q29zdCh0aGlzLmFjdGl2YXRpb25GdW5jdGlvbnMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICBcbiAgICB0aGlzLm5ldXJvbnNMYXllcnMgPSBbXTtcbiAgICB0aGlzLnN5bmFwc2VzTGF5ZXJzID0gW107XG4gICAgdGhpcy5udW1iZXJPZlN5bmFwc2VzID0gMDtcblxuICAgIC8vbGF5ZXJzIGNyZWF0aW9uXG4gICAgdGhpcy5uZXVyb25zTGF5ZXJzLnB1c2godGhpcy5pbnB1dExheWVyID0gbmV3IElucHV0TGF5ZXIoY29uZmlnLmlucHV0TGF5ZXJTaXplKSk7XG4gICAgZm9yIChsZXQgaSA9IDAgOyBpIDwgY29uZmlnLmhpZGRlbkxheWVycy5sZW5ndGggOyBpKyspIHtcbiAgICAgIHRoaXMubmV1cm9uc0xheWVycy5wdXNoKG5ldyBIaWRkZW5MYXllcihjb25maWcuaGlkZGVuTGF5ZXJzW2ldKSk7XG4gICAgfVxuICAgIHRoaXMubmV1cm9uc0xheWVycy5wdXNoKHRoaXMub3V0cHV0TGF5ZXIgPSBuZXcgT3V0cHV0TGF5ZXIoY29uZmlnLm91dHB1dExheWVyU2l6ZSkpO1xuXG4gICAgLy9zeW5hcHNlcyBjcmVhdGlvblxuICAgIGZvciAobGV0IGogPSAwIDsgaiA8IHRoaXMubmV1cm9uc0xheWVycy5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgIGxldCBzeW5hcHNlcyA9IHRoaXMubmV1cm9uc0xheWVyc1tqXS5saW5rVG8odGhpcy5uZXVyb25zTGF5ZXJzW2ogKyAxXSk7XG4gICAgICB0aGlzLnN5bmFwc2VzTGF5ZXJzLnB1c2goc3luYXBzZXMpO1xuICAgICAgdGhpcy5udW1iZXJPZlN5bmFwc2VzICs9IHN5bmFwc2VzLmxlbmd0aDtcbiAgICB9XG5cbiAgfVxuXG4gIGdldCB3ZWlnaHRzICgpOiBudW1iZXJbXSB7XG4gICAgXG4gICAgbGV0IHdlaWdodHMgPSBbXTtcbiAgICBcbiAgICB0aGlzLmZvckVhY2hTeW5hcHNlKChzKSA9PiB7XG4gICAgICB3ZWlnaHRzLnB1c2gocy53ZWlnaHQpO1xuICAgIH0pO1xuICAgIHJldHVybiB3ZWlnaHRzO1xuICAgIFxuICB9XG4gIHNldCB3ZWlnaHRzIChzeW5hcHNlczogbnVtYmVyW10pIHtcbiAgICBcbiAgICBpZiAoc3luYXBzZXMubGVuZ3RoICE9PSB0aGlzLm51bWJlck9mU3luYXBzZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIG51bWJlciBvZiBzeW5hcHNlcyBkaWZmZXJzLmApO1xuICAgIH1cbiAgICBcbiAgICBsZXQgY3B0ID0gMDtcbiAgICBcbiAgICB0aGlzLmZvckVhY2hTeW5hcHNlKChzKSA9PiB7XG4gICAgICBzLndlaWdodCA9IHN5bmFwc2VzW2NwdCsrXTtcbiAgICB9KTtcbiAgICBcbiAgfVxuICBcbiAgcHVibGljIGdldEdyYWRpZW50cyAoZGF0YTogSVRyYWluaW5nRGF0YSk6IG51bWJlcltdIHtcbiAgICBcbiAgICBsZXQgZ3JhZGllbnRzID0gW107IFxuICAgIFxuICAgIHRoaXMuYmFja3dhcmQoZGF0YSk7XG4gICAgdGhpcy5mb3JFYWNoU3luYXBzZSgocykgPT4ge1xuICAgICAgZ3JhZGllbnRzLnB1c2gocy5ncmFkaWVudCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGdyYWRpZW50cztcbiAgICBcbiAgfVxuICBcbiAgcHVibGljIGZvckVhY2hTeW5hcHNlIChmdW5jOiAoeDogU3luYXBzZSwgaW5kZXhJPzogbnVtYmVyLCBpbmRleEo/OiBudW1iZXIpID0+IHZvaWQpIHtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3luYXBzZXNMYXllcnMubGVuZ3RoIDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuc3luYXBzZXNMYXllcnNbaV0ubGVuZ3RoIDsgaisrKSB7XG4gICAgICAgIGZ1bmModGhpcy5zeW5hcHNlc0xheWVyc1tpXVtqXSwgaSwgaik7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICB9XG5cbiAgcHVibGljIGZvcndhcmQgKGRhdGE6IElUcmFpbmluZ0RhdGEpOiBudW1iZXJbXVtdIHtcblxuICAgIGxldCByZXQgPSBbXTtcblxuICAgIGZvciAobGV0IGsgPSAwIDsgayA8IGRhdGEubGVuZ3RoIDsgayArKyApIHtcbiAgICAgIFxuICAgICAgLy9zZXQgaW5wdXQgdG8gaW5wdXQgbGF5ZXIgbmV1cm9uc1xuICAgICAgdGhpcy5pbnB1dExheWVyLm5ldXJvbnNWYWx1ZSA9IGRhdGFba10uaW5wdXQ7XG4gICAgICAvL3Byb3BhZ2F0ZSBvbiBlYWNoIGhpZGRlbiBsYXllciBhbmQgb3V0cHV0XG4gICAgICBmb3IgKGxldCBpID0gMSA7IGkgPCB0aGlzLm5ldXJvbnNMYXllcnMubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgIHRoaXMubmV1cm9uc0xheWVyc1tpXS5hY3RpdmF0ZSh0aGlzLmFjdGl2YXRpb25GdW5jdGlvbnMpO1xuICAgICAgfVxuICAgICAgLy9yZXRyaWV2ZSBvdXRwdXQgbmV1cm9uIHZhbHVlXG4gICAgICByZXQucHVzaCh0aGlzLm91dHB1dExheWVyLm5ldXJvbnNWYWx1ZSk7XG4gICAgICBcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgICBcbiAgfVxuXG4gIHB1YmxpYyBjb3N0IChkYXRhOiBJVHJhaW5pbmdEYXRhKTogbnVtYmVyIHtcblxuICAgIGxldCB5SGF0cyA9IHRoaXMuZm9yd2FyZChkYXRhKSxcbiAgICAgICAgajogbnVtYmVyID0gMCxcbiAgICAgICAgd2VpZ2h0c1N1bSA9IDA7XG4gICAgXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBkYXRhLmxlbmd0aDsgaysrKSB7XG4gICAgICBqICs9IHRoaXMuY29zdFN0cmF0ZWd5LmZuKGRhdGFba10ub3V0cHV0LCB5SGF0c1trXSk7XG4gICAgfVxuICAgIFxuICAgIGogPSBqIC8gZGF0YS5sZW5ndGg7XG4gICAgXG4gICAgdGhpcy5mb3JFYWNoU3luYXBzZSgocykgPT4ge1xuICAgICAgd2VpZ2h0c1N1bSArPSBNYXRoLnBvdyhzLndlaWdodCwgMik7XG4gICAgfSk7XG4gICAgXG4gICAgaiArPSB0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMucmVndWxhcml6YXRpb24gLyAoMiAqIGRhdGEubGVuZ3RoKSAqIHdlaWdodHNTdW07XG4gICAgXG4gICAgcmV0dXJuIGo7XG4gXG4gIH1cblxuICBwdWJsaWMgYmFja3dhcmQgKGRhdGE6IElUcmFpbmluZ0RhdGEpOiBJU3luYXBzZXNMYXllcltdIHtcblxuICAgIGxldCByZXQgPSBbXTtcblxuICAgIGZvciAobGV0IGsgPSAwIDsgayA8IGRhdGEubGVuZ3RoIDsgayArKyApIHtcbiAgICAgIFxuICAgICAgbGV0IHR1cGxlID0gZGF0YVtrXSxcbiAgICAgICAgICB5SGF0ID0gdGhpcy5mb3J3YXJkKFt0dXBsZV0pWzBdO1xuXG4gICAgICAvL3NldCB0aGUgaW5wdXQgYW5kIG91dHB1dCBsYXllciB2YWx1ZVxuICAgICAgdGhpcy5pbnB1dExheWVyLm5ldXJvbnNWYWx1ZSA9IHR1cGxlLmlucHV0O1xuICAgICAgdGhpcy5vdXRwdXRMYXllci5uZXVyb25zVmFsdWUgPSBzdWIoeUhhdCwgdHVwbGUub3V0cHV0KTtcbiAgICAgIC8vY29tcHV0ZSBwcm9wYWdhdGlvbiBlcnJvcnMgZm9yIGFsbCBsYXllcnMgZXhwZWN0IGlucHV0XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5uZXVyb25zTGF5ZXJzLmxlbmd0aCAtIDEgOyBpID49IDEgOyBpLS0pIHtcbiAgICAgICAgdGhpcy5uZXVyb25zTGF5ZXJzW2ldLmNvbXB1dGVFcnJvcnModGhpcy5jb3N0U3RyYXRlZ3kpO1xuICAgICAgfVxuICAgICAgLy9jb21wdXRlIGRKZFcgZm9yIGFsbCBzeW5hcHNlcyBsYXllclxuICAgICAgZm9yIChsZXQgaSA9IDAgOyBpIDwgdGhpcy5uZXVyb25zTGF5ZXJzLmxlbmd0aCAgOyBpKyspIHtcbiAgICAgICAgdGhpcy5uZXVyb25zTGF5ZXJzW2ldLmNvbXB1dGVHcmFkaWVudHMoKTtcbiAgICAgIH1cblxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdGhpcy5zeW5hcHNlc0xheWVycztcblxuICB9XG5cbiAgcHVibGljIGFkanVzdFdlaWdodHMgKHN5bmFwc2VzOiBJU3luYXBzZXNMYXllcltdLCBiYXRjaFNpemU6IG51bWJlciwgZGF0YVNpemU6IG51bWJlcikge1xuXG4gICAgaWYgKHN5bmFwc2VzLmxlbmd0aCAhPT0gdGhpcy5zeW5hcHNlc0xheWVycy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIG51bWJlciBvZiBzeW5hcHNlcyBsYXllcnMgZGlmZmVycy5gKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW5hcHNlcy5sZW5ndGggOyBpKyspIHtcbiAgICAgIGlmIChzeW5hcHNlc1tpXS5sZW5ndGggIT09IHRoaXMuc3luYXBzZXNMYXllcnNbaV0ubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIG51bWJlciBvZiBzeW5hcHNlcyBpbiB0aGUgJHtpfSBsYXllciBkaWZmZXJzYCk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHRoaXMuZm9yRWFjaFN5bmFwc2UoKHMpID0+IHtcbiAgICAgIHMud2VpZ2h0ID0gKDEgLSB0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMubGVhcm5pbmdSYXRlICogdGhpcy5jb25maWcudHJhaW5pbmdPcHRpb25zLnJlZ3VsYXJpemF0aW9uIC8gZGF0YVNpemUpICogcy53ZWlnaHQgLSB0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMubGVhcm5pbmdSYXRlIC8gYmF0Y2hTaXplICogcy5ncmFkaWVudDtcbiAgICAgIHMuZ3JhZGllbnQgPSAwO1xuICAgIH0pO1xuICAgIFxuICB9XG4gIFxuICBwdWJsaWMgdHJhaW4gKGRhdGE6IElUcmFpbmluZ0RhdGEsIG9wdGlvbnM/OiBJVHJhaW5pbmdDb25maWd1cmF0aW9uKTogSVRyYWluaW5nT3V0cHV0IHtcbiAgICBcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLnRyYWluaW5nT3B0aW9ucywgb3B0aW9ucyk7XG4gICAgXG4gICAgbGV0IGl0ZXJhdGlvbnMgPSB0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMuaXRlcmF0aW9ucyxcbiAgICAgICAgYmF0Y2hTaXplID0gdGhpcy5jb25maWcudHJhaW5pbmdPcHRpb25zLmJhdGNoU2l6ZSA9ICh0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMuYmF0Y2hTaXplID4gZGF0YS5sZW5ndGgpID8gZGF0YS5sZW5ndGggOiB0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMuYmF0Y2hTaXplO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwIDsgaSA8IGl0ZXJhdGlvbnMgOyBpKyspIHtcbiAgICAgIFxuICAgICAgaWYgKGJhdGNoU2l6ZSAmJiBiYXRjaFNpemUgIT09IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgIHNodWZmbGUoZGF0YSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGxldCBiYXRjaCA9IGRhdGEuc2xpY2UoMCwgYmF0Y2hTaXplKSwgXG4gICAgICAgICAgc3luYXBzZXMgPSB0aGlzLmJhY2t3YXJkKGJhdGNoKTtcbiAgICAgICAgICBcbiAgICAgIHRoaXMuYWRqdXN0V2VpZ2h0cyhzeW5hcHNlcywgYmF0Y2hTaXplLCBkYXRhLmxlbmd0aCk7XG4gICAgICBcbiAgICAgIGlmICh0aGlzLmNvbmZpZy50cmFpbmluZ09wdGlvbnMubG9nICYmIChpICUgKGl0ZXJhdGlvbnMvMTAwKSA9PT0gMCkpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKGBQcm9ncmVzcyAke2kgLyBpdGVyYXRpb25zfSwgY29zdDogJHt0aGlzLmNvc3QoZGF0YSl9YCk7XG4gICAgICB9XG4gICAgXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBlcnJvcjogdGhpcy5jb3N0KGRhdGEpXG4gICAgfTtcbiAgICBcbiAgfVxuICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVOdW1lcmljYWxHcmFkaWVudHMgKG46IE5ldXJhbE5ldHdvcmssIGRhdGE6IElUcmFpbmluZ0RhdGEpIHtcblxuICBsZXQgZXBzaWxvbiA9IDFlLTQsXG4gICAgICBpbml0aWFsV2VpZ2h0czogbnVtYmVyW10gPSBuLndlaWdodHMsXG4gICAgICBudW1HcmFkcyA9IGluaXRpYWxXZWlnaHRzLmxlbmd0aCxcbiAgICAgIGdyYWRpZW50czogbnVtYmVyW10gPSB6ZXJvcyhudW1HcmFkcyksXG4gICAgICBwZXJ0dXJiOiBBcnJheTxudW1iZXI+ID0gemVyb3MobnVtR3JhZHMpLFxuICAgICAgaztcbiAgICBcbiAgZm9yIChrID0gMDsgayA8IG51bUdyYWRzOyBrKyspIHtcblxuICAgIGxldCBsb3NzMSwgbG9zczI7XG5cbiAgICBwZXJ0dXJiW2tdID0gZXBzaWxvbjtcbiAgICBuLndlaWdodHMgPSBhZGQoaW5pdGlhbFdlaWdodHMsIHBlcnR1cmIpO1xuICAgIGxvc3MyID0gbi5jb3N0KGRhdGEpO1xuICAgIG4ud2VpZ2h0cyA9IHN1Yihpbml0aWFsV2VpZ2h0cywgcGVydHVyYik7XG4gICAgbG9zczEgPSBuLmNvc3QoZGF0YSlcbiAgICBncmFkaWVudHNba10gPSBkYXRhLmxlbmd0aCAqIHN1bShtdWx0aXBseUJ5U2NhbGFyKHN1YihbbG9zczJdLCBbbG9zczFdKSwgMSAvIChlcHNpbG9uICogMikpKTtcbiAgICBwZXJ0dXJiW2tdID0gMDtcblxuICB9XG4gIG4ud2VpZ2h0cyA9IGluaXRpYWxXZWlnaHRzO1xuICByZXR1cm4gZ3JhZGllbnRzO1xuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=