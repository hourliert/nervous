/// <reference path="./all.d.ts" />
var Synapse = (function () {
    function Synapse(input, output, weight) {
        this.input = input;
        this.output = output;
        this.id = "s_" + input.id + "_" + output.id;
        this.weight = weight;
        this.gradient = 0;
    }
    Object.defineProperty(Synapse.prototype, "neurons", {
        get: function () {
            return {
                input: this.input,
                output: this.output
            };
        },
        set: function (neurons) {
            this.input = neurons.input;
            this.output = neurons.output;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Synapse.prototype, "weight", {
        get: function () {
            return this.value;
        },
        set: function (value) {
            this.value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Synapse.prototype, "gradient", {
        get: function () {
            return this.dJdW;
        },
        set: function (value) {
            this.dJdW = value;
        },
        enumerable: true,
        configurable: true
    });
    return Synapse;
})();
exports.Synapse = Synapse;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN5bmFwc2UudHMiXSwibmFtZXMiOlsiU3luYXBzZSIsIlN5bmFwc2UuY29uc3RydWN0b3IiLCJTeW5hcHNlLm5ldXJvbnMiLCJTeW5hcHNlLndlaWdodCIsIlN5bmFwc2UuZ3JhZGllbnQiXSwibWFwcGluZ3MiOiJBQUFBLG1DQUFtQztBQVVuQztJQUtFQSxpQkFDVUEsS0FBYUEsRUFDYkEsTUFBY0EsRUFDdEJBLE1BQWNBO1FBRk5DLFVBQUtBLEdBQUxBLEtBQUtBLENBQVFBO1FBQ2JBLFdBQU1BLEdBQU5BLE1BQU1BLENBQVFBO1FBR3RCQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxPQUFLQSxLQUFLQSxDQUFDQSxFQUFFQSxTQUFJQSxNQUFNQSxDQUFDQSxFQUFJQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBO0lBQ3BCQSxDQUFDQTtJQUVERCxzQkFBSUEsNEJBQU9BO2FBQVhBO1lBQ0VFLE1BQU1BLENBQUNBO2dCQUNMQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQSxLQUFLQTtnQkFDakJBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBLE1BQU1BO2FBQ3BCQSxDQUFDQTtRQUNKQSxDQUFDQTthQUNERixVQUFZQSxPQUFvQkE7WUFDOUJFLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO1lBQzNCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMvQkEsQ0FBQ0E7OztPQUpBRjtJQU1EQSxzQkFBSUEsMkJBQU1BO2FBQVZBO1lBQ0VHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO1FBQ3BCQSxDQUFDQTthQUNESCxVQUFZQSxLQUFhQTtZQUN2QkcsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDckJBLENBQUNBOzs7T0FIQUg7SUFLREEsc0JBQUlBLDZCQUFRQTthQUFaQTtZQUNFSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNuQkEsQ0FBQ0E7YUFDREosVUFBY0EsS0FBYUE7WUFDekJJLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3BCQSxDQUFDQTs7O09BSEFKO0lBSUhBLGNBQUNBO0FBQURBLENBdkNBLEFBdUNDQSxJQUFBO0FBdkNZLGVBQU8sVUF1Q25CLENBQUEiLCJmaWxlIjoic3luYXBzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2FsbC5kLnRzXCIgLz5cblxuaW1wb3J0IHtOZXVyb259IGZyb20gJy4vbmV1cm9uJztcblxuZXhwb3J0IGludGVyZmFjZSBJU3luYXBzZXNMYXllciBleHRlbmRzIEFycmF5PFN5bmFwc2U+IHt9XG5leHBvcnQgaW50ZXJmYWNlIElOZXVyb25zRW5kIHtcbiAgaW5wdXQ6IE5ldXJvbjtcbiAgb3V0cHV0OiBOZXVyb247XG59XG5cbmV4cG9ydCBjbGFzcyBTeW5hcHNlIHtcbiAgcHVibGljIGlkOiBzdHJpbmc7XG4gIHByaXZhdGUgdmFsdWU6IG51bWJlcjtcbiAgcHJpdmF0ZSBkSmRXOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IgKFxuICAgIHByaXZhdGUgaW5wdXQ6IE5ldXJvbixcbiAgICBwcml2YXRlIG91dHB1dDogTmV1cm9uLFxuICAgIHdlaWdodDogbnVtYmVyXG4gICkge1xuICAgIHRoaXMuaWQgPSBgc18ke2lucHV0LmlkfV8ke291dHB1dC5pZH1gO1xuICAgIHRoaXMud2VpZ2h0ID0gd2VpZ2h0O1xuICAgIHRoaXMuZ3JhZGllbnQgPSAwO1xuICB9XG4gIFxuICBnZXQgbmV1cm9ucygpOiBJTmV1cm9uc0VuZCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlucHV0OiB0aGlzLmlucHV0LCBcbiAgICAgIG91dHB1dDogdGhpcy5vdXRwdXRcbiAgICB9O1xuICB9XG4gIHNldCBuZXVyb25zKG5ldXJvbnM6IElOZXVyb25zRW5kKSB7XG4gICAgdGhpcy5pbnB1dCA9IG5ldXJvbnMuaW5wdXQ7XG4gICAgdGhpcy5vdXRwdXQgPSBuZXVyb25zLm91dHB1dDtcbiAgfVxuICBcbiAgZ2V0IHdlaWdodCAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuICBzZXQgd2VpZ2h0ICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG4gIFxuICBnZXQgZ3JhZGllbnQgKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZEpkVztcbiAgfVxuICBzZXQgZ3JhZGllbnQgKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLmRKZFcgPSB2YWx1ZTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9