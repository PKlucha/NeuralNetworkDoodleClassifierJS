var m = require('./MatrixLib.js');

function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}
function dsigmoid(x) {
	return x * (1 - x);
}

class NeuralNetwork {
	constructor(input_nodes, hidden_nodes, output_nodes) {
		this.input_nodes = input_nodes;
		this.hidden_nodes = hidden_nodes;
		this.output_nodes = output_nodes;
		
		this.weights_ih = new m.Matrix(this.hidden_nodes, this.input_nodes);
		this.weights_ho = new m.Matrix(this.output_nodes, this.hidden_nodes);
		this.weights_ih.randomize();
		this.weights_ho.randomize();

		this.bias_h = new m.Matrix(this.hidden_nodes, 1);
		this.bias_o = new m.Matrix(this.output_nodes, 1);
		this.bias_h.randomize();
		this.bias_o.randomize();

		this.learning_rate = 0.1;
	}

	feedForward(input_array) {
		let inputs = m.Matrix.fromArray(input_array);

		// Generating the hidden outputs
		let hidden = m.Matrix.multiply(this.weights_ih, inputs);
		hidden.add(this.bias_h);
		hidden.map(sigmoid);

		// Generating the output's output
		let output = m.Matrix.multiply(this.weights_ho, hidden);
		output.add(this.bias_o);
		output.map(sigmoid);

		return output.toArray();
	}

	train(input_array, target_array) {
		// Generating the hidden outputs
		let inputs = m.Matrix.fromArray(input_array);

		let hidden = m.Matrix.multiply(this.weights_ih, inputs);
		hidden.add(this.bias_h);
		hidden.map(sigmoid);

		// Generating the output's output
		let outputs = m.Matrix.multiply(this.weights_ho, hidden);
		outputs.add(this.bias_o);
		outputs.map(sigmoid);

		let targets = m.Matrix.fromArray(target_array);

		// Calculating error
		let output_errors = m.Matrix.subtract(targets, outputs);
		
		let gradients = m.Matrix.map(outputs, dsigmoid);
		gradients.multiply(output_errors);
		gradients.multiply(this.learning_rate);

		// Calculating hidden layer errors
		let hidden_T = m.Matrix.transpose(hidden);
		let weights_ho_deltas = m.Matrix.multiply(gradients, hidden_T);

		// Adjusting hidden->output
		this.weights_ho.add(weights_ho_deltas);
		this.bias_o.add(gradients);

		let who_T = m.Matrix.transpose(this.weights_ho);
		let hidden_errors = m.Matrix.multiply(who_T, output_errors);

		// Calculating hidden gradient
		let hidden_gradient = m.Matrix.map(hidden, dsigmoid);
		hidden_gradient.multiply(hidden_errors);
		hidden_gradient.multiply(this.learning_rate);

		// Calculate ih deltas
		let inputs_T = m.Matrix.transpose(inputs);
		let weights_ih_deltas = m.Matrix.multiply(hidden_gradient, inputs_T);

		// Adjusting input->hidden
		this.weights_ih.add(weights_ih_deltas);
		this.bias_h.add(hidden_gradient);

		//console.table(outputs.data);
		//console.table(target_array);
	}

	setLearningRate(x) {
		this.learning_rate = x;
	}
	getLearningRate() {
		return this.learning_rate;
	}
} 

module.exports.NeuralNetwork = NeuralNetwork;