/// <reference path="./all.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var neuron_1 = require('./neuron');
var synapse_1 = require('./synapse');
var Layer = (function () {
    function Layer(size) {
        this.id = "l_" + Layer.currentId++;
        this.neurons = [];
    }
    Object.defineProperty(Layer.prototype, "neuronsValue", {
        get: function () {
            var ret = [];
            this.forEachNeuron(function (n) { return ret.push(n.A); });
            return ret;
        },
        set: function (values) {
            var hasBiasNeuron = (this.neurons[this.neurons.length - 1] instanceof neuron_1.BiasNeuron) ? 1 : 0;
            if (values.length !== (this.neurons.length - hasBiasNeuron)) {
                throw new Error("The size of the input " + values.length + " differs fron the number of neurons " + (this.neurons.length - hasBiasNeuron));
            }
            this.forEachNeuron(function (n, index) { return n.A = values[index]; });
        },
        enumerable: true,
        configurable: true
    });
    Layer.prototype.linkTo = function (layer) {
        var synapses = [];
        for (var i = 0; i < this.neurons.length; i++) {
            var n1 = this.neurons[i];
            for (var j = 0; j < layer.neurons.length; j++) {
                var n2 = layer.neurons[j], s = new synapse_1.Synapse(n1, n2, Math.random() / Math.sqrt(this.neurons.length));
                n1.addOutputSynapse(s);
                n2.addInputSynapse(s);
                synapses.push(s);
            }
        }
        return synapses;
    };
    Layer.prototype.forEachNeuron = function (func) {
        for (var i = 0; i < this.neurons.length; i++) {
            func(this.neurons[i], i);
        }
    };
    Layer.prototype.activate = function (activationFunctions) {
        this.forEachNeuron(function (n) { return n.activate(activationFunctions); });
    };
    Layer.prototype.computeErrors = function (costStrategy) {
        this.forEachNeuron(function (n) { return n.computeError(costStrategy); });
    };
    Layer.prototype.computeGradients = function () {
        this.forEachNeuron(function (n) { return n.backPropagate(); });
    };
    Layer.currentId = 0;
    return Layer;
})();
exports.Layer = Layer;
var InputLayer = (function (_super) {
    __extends(InputLayer, _super);
    function InputLayer(size) {
        _super.call(this, size);
        for (var i = 0; i < size; i++) {
            this.neurons.push(new neuron_1.InputNeuron(this, i));
        }
        this.neurons.push(new neuron_1.BiasNeuron(this, size));
    }
    InputLayer.prototype.activate = function () {
        throw new Error("The input layer could not propagate using a previous layer");
    };
    return InputLayer;
})(Layer);
exports.InputLayer = InputLayer;
var HiddenLayer = (function (_super) {
    __extends(HiddenLayer, _super);
    function HiddenLayer(size) {
        _super.call(this, size);
        for (var i = 0; i < size; i++) {
            this.neurons.push(new neuron_1.HiddenNeuron(this, i));
        }
        this.neurons.push(new neuron_1.BiasNeuron(this, size));
    }
    return HiddenLayer;
})(Layer);
exports.HiddenLayer = HiddenLayer;
var OutputLayer = (function (_super) {
    __extends(OutputLayer, _super);
    function OutputLayer(size) {
        _super.call(this, size);
        for (var i = 0; i < size; i++) {
            this.neurons.push(new neuron_1.OutputNeuron(this, i));
        }
    }
    return OutputLayer;
})(Layer);
exports.OutputLayer = OutputLayer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheWVyLnRzIl0sIm5hbWVzIjpbIkxheWVyIiwiTGF5ZXIuY29uc3RydWN0b3IiLCJMYXllci5uZXVyb25zVmFsdWUiLCJMYXllci5saW5rVG8iLCJMYXllci5mb3JFYWNoTmV1cm9uIiwiTGF5ZXIuYWN0aXZhdGUiLCJMYXllci5jb21wdXRlRXJyb3JzIiwiTGF5ZXIuY29tcHV0ZUdyYWRpZW50cyIsIklucHV0TGF5ZXIiLCJJbnB1dExheWVyLmNvbnN0cnVjdG9yIiwiSW5wdXRMYXllci5hY3RpdmF0ZSIsIkhpZGRlbkxheWVyIiwiSGlkZGVuTGF5ZXIuY29uc3RydWN0b3IiLCJPdXRwdXRMYXllciIsIk91dHB1dExheWVyLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiQUFBQSxtQ0FBbUM7Ozs7Ozs7QUFFbkMsdUJBQTBFLFVBQVUsQ0FBQyxDQUFBO0FBQ3JGLHdCQUFzQyxXQUFXLENBQUMsQ0FBQTtBQUtsRDtJQU9FQSxlQUNFQSxJQUFZQTtRQUdaQyxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxPQUFLQSxLQUFLQSxDQUFDQSxTQUFTQSxFQUFJQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0E7SUFFcEJBLENBQUNBO0lBRURELHNCQUFJQSwrQkFBWUE7YUFBaEJBO1lBRUVFLElBQUlBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ2JBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFVBQUNBLENBQUNBLElBQUtBLE9BQUFBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQWJBLENBQWFBLENBQUNBLENBQUNBO1lBQ3pDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUViQSxDQUFDQTthQUNERixVQUFrQkEsTUFBZ0JBO1lBRWhDRSxJQUFJQSxhQUFhQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxN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bnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYWxsLmQudHNcIiAvPlxuXG5pbXBvcnQge05ldXJvbiwgQmlhc05ldXJvbiwgSW5wdXROZXVyb24sIEhpZGRlbk5ldXJvbiwgT3V0cHV0TmV1cm9ufSBmcm9tICcuL25ldXJvbic7XG5pbXBvcnQge1N5bmFwc2UsIElTeW5hcHNlc0xheWVyfSBmcm9tICcuL3N5bmFwc2UnO1xuaW1wb3J0IHtJQWN0aXZhdGlvbkZ1bmN0aW9uc30gZnJvbSAnLi9uZXVyYWwtbmV0d29yayc7XG5pbXBvcnQge0Nvc3RTdHJhdGVneX0gZnJvbSAnLi9jb3N0JztcblxuXG5leHBvcnQgY2xhc3MgTGF5ZXIge1xuICBcbiAgc3RhdGljIGN1cnJlbnRJZDogbnVtYmVyID0gMDtcbiAgXG4gIHB1YmxpYyBpZDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgbmV1cm9uczogTmV1cm9uW107XG4gIFxuICBjb25zdHJ1Y3RvciAoXG4gICAgc2l6ZTogbnVtYmVyXG4gICkge1xuICAgIFxuICAgIHRoaXMuaWQgPSBgbF8ke0xheWVyLmN1cnJlbnRJZCsrfWA7XG4gICAgdGhpcy5uZXVyb25zID0gW107XG4gICAgICBcbiAgfVxuICBcbiAgZ2V0IG5ldXJvbnNWYWx1ZSAoKTogbnVtYmVyW10ge1xuICAgIFxuICAgIGxldCByZXQgPSBbXTtcbiAgICB0aGlzLmZvckVhY2hOZXVyb24oKG4pID0+IHJldC5wdXNoKG4uQSkpO1xuICAgIHJldHVybiByZXQ7XG4gICAgXG4gIH1cbiAgc2V0IG5ldXJvbnNWYWx1ZSAodmFsdWVzOiBudW1iZXJbXSkge1xuICAgIFxuICAgIGxldCBoYXNCaWFzTmV1cm9uID0gKHRoaXMubmV1cm9uc1t0aGlzLm5ldXJvbnMubGVuZ3RoIC0xXSBpbnN0YW5jZW9mIEJpYXNOZXVyb24pID8gMSA6IDA7XG4gICAgaWYgKHZhbHVlcy5sZW5ndGggIT09ICh0aGlzLm5ldXJvbnMubGVuZ3RoIC0gaGFzQmlhc05ldXJvbikpIHsgLy93aXRob3V0IHRoZSBiaWFzXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBzaXplIG9mIHRoZSBpbnB1dCAke3ZhbHVlcy5sZW5ndGh9IGRpZmZlcnMgZnJvbiB0aGUgbnVtYmVyIG9mIG5ldXJvbnMgJHt0aGlzLm5ldXJvbnMubGVuZ3RoIC0gaGFzQmlhc05ldXJvbn1gKTtcbiAgICB9XG4gICAgdGhpcy5mb3JFYWNoTmV1cm9uKChuLCBpbmRleCkgPT4gbi5BID0gdmFsdWVzW2luZGV4XSk7XG4gICAgXG4gIH1cbiAgXG4gIHB1YmxpYyBsaW5rVG8gKGxheWVyOiBMYXllcik6IElTeW5hcHNlc0xheWVyIHtcbiAgICBcbiAgICBsZXQgc3luYXBzZXMgPSBbXTtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubmV1cm9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgXG4gICAgICBsZXQgbjEgPSB0aGlzLm5ldXJvbnNbaV07IFxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsYXllci5uZXVyb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIFxuICAgICAgICBsZXQgbjIgPSBsYXllci5uZXVyb25zW2pdLFxuICAgICAgICAgICAgcyA9IG5ldyBTeW5hcHNlKG4xLCBuMiwgTWF0aC5yYW5kb20oKSAvIE1hdGguc3FydCh0aGlzLm5ldXJvbnMubGVuZ3RoKSk7XG4gICAgICAgIFxuICAgICAgICBuMS5hZGRPdXRwdXRTeW5hcHNlKHMpO1xuICAgICAgICBuMi5hZGRJbnB1dFN5bmFwc2Uocyk7XG4gICAgICAgIHN5bmFwc2VzLnB1c2gocyk7XG4gICAgICAgIFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3luYXBzZXM7XG4gICAgXG4gIH1cbiAgXG4gIHB1YmxpYyBmb3JFYWNoTmV1cm9uIChmdW5jOiAoeDogTmV1cm9uLCBpbmRleD86IG51bWJlcikgPT4gdm9pZCkge1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwIDsgaSA8IHRoaXMubmV1cm9ucy5sZW5ndGggOyBpKyspIHtcbiAgICAgIGZ1bmModGhpcy5uZXVyb25zW2ldLCBpKTtcbiAgICB9XG4gICAgXG4gIH1cbiAgXG4gIHB1YmxpYyBhY3RpdmF0ZSAoYWN0aXZhdGlvbkZ1bmN0aW9uczogSUFjdGl2YXRpb25GdW5jdGlvbnMpIHtcbiAgICBcbiAgICB0aGlzLmZvckVhY2hOZXVyb24oKG4pID0+IG4uYWN0aXZhdGUoYWN0aXZhdGlvbkZ1bmN0aW9ucykpO1xuICAgIFxuICB9XG4gIFxuICBwdWJsaWMgY29tcHV0ZUVycm9ycyAoY29zdFN0cmF0ZWd5OiBDb3N0U3RyYXRlZ3kpIHtcbiAgICBcbiAgICB0aGlzLmZvckVhY2hOZXVyb24oKG4pID0+IG4uY29tcHV0ZUVycm9yKGNvc3RTdHJhdGVneSkpO1xuICAgIFxuICB9XG4gIFxuICBwdWJsaWMgY29tcHV0ZUdyYWRpZW50cyAoKSB7XG4gICAgXG4gICAgdGhpcy5mb3JFYWNoTmV1cm9uKChuKSA9PiBuLmJhY2tQcm9wYWdhdGUoKSk7XG4gICAgXG4gIH1cbiAgXG59XG5cbmV4cG9ydCBjbGFzcyBJbnB1dExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBcbiAgY29uc3RydWN0b3IgKFxuICAgIHNpemU6IG51bWJlclxuICApIHtcbiAgICBcbiAgICBzdXBlcihzaXplKTsgICAgXG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIHRoaXMubmV1cm9ucy5wdXNoKG5ldyBJbnB1dE5ldXJvbih0aGlzLCBpKSk7ICAgIFxuICAgIH0gXG4gICAgXG4gICAgdGhpcy5uZXVyb25zLnB1c2gobmV3IEJpYXNOZXVyb24odGhpcywgc2l6ZSkpO1xuICAgIFxuICB9XG4gIFxuICBwdWJsaWMgYWN0aXZhdGUgKCkge1xuICAgIFxuICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGlucHV0IGxheWVyIGNvdWxkIG5vdCBwcm9wYWdhdGUgdXNpbmcgYSBwcmV2aW91cyBsYXllcmApO1xuICAgIFxuICB9XG4gIFxufVxuXG5cbmV4cG9ydCBjbGFzcyBIaWRkZW5MYXllciBleHRlbmRzIExheWVyIHtcbiAgXG4gIGNvbnN0cnVjdG9yIChcbiAgICBzaXplOiBudW1iZXJcbiAgKSB7XG4gICAgXG4gICAgc3VwZXIoc2l6ZSk7IFxuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICB0aGlzLm5ldXJvbnMucHVzaChuZXcgSGlkZGVuTmV1cm9uKHRoaXMsIGkpKTsgICAgXG4gICAgfSBcbiAgICAgICBcbiAgICB0aGlzLm5ldXJvbnMucHVzaChuZXcgQmlhc05ldXJvbih0aGlzLCBzaXplKSk7XG4gICAgXG4gIH1cbiAgXG59XG5cbmV4cG9ydCBjbGFzcyBPdXRwdXRMYXllciBleHRlbmRzIExheWVyIHtcbiAgXG4gIGNvbnN0cnVjdG9yIChcbiAgICBzaXplOiBudW1iZXJcbiAgKSB7XG4gICAgXG4gICAgc3VwZXIoc2l6ZSk7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIHRoaXMubmV1cm9ucy5wdXNoKG5ldyBPdXRwdXROZXVyb24odGhpcywgaSkpOyAgICBcbiAgICB9IFxuICAgICAgICBcbiAgfVxuICBcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=