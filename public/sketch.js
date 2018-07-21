const len = 784; // Length of one picture in data (28*28)
const totalDataObjects = 1000; // Number of images sent from server
const trainingRatio = 0.8; // Percent of data used as training data
const epsilon = 0.1; // Accepted error of Network's output
const learningRateMultiplicator = 0.99999; // 0.99995 is best for 3 classes and short learning (1-4e) 
const dataClasses = 3;

const epoch = 3; // How many times train with full set of training examples

// Maping for classes
const AIRPLAIN = 0;
const APPLE = 1;
const BICYCLE = 2;

var socket; // Connection to server
var data; // All of the data from server
var brain; // NeuralNetwork Object // Maciek
var airplains = {};
var apples = {};
var bicycles = {};

var trainingExamples = totalDataObjects * trainingRatio; // TrainingData examples
var dataReady; // Boolean flag

function preload() {
	// Connecting to socket and "downloading" training data
	dataReady = false;
	socket = io.connect('http://localhost:3000');

	socket.on('training_data', function(inData){
		// Converting data to array from arraybuffer
		data = inData;
		data[0] = new Uint8Array(data[0]);
		data[1] = new Uint8Array(data[1]);
		data[2] = new Uint8Array(data[2]);

		console.log("Data received!");
		console.log("Preparing data...");
	});

	// Waiting for data to be received
	setTimeout(function() {
		prepareData(airplains, data, AIRPLAIN);
		prepareData(apples, data, APPLE);
		prepareData(bicycles, data, BICYCLE);

		dataReady = true;
		console.log("Data ready!");
	}, 2000);

	// Creating Neural Network
	brain = new NeuralNetwork(len, 64, dataClasses); // 784 inputs, 64 hidden and 2 outputs
}

function prepareData(category, data, numInData) { // numInData is a offset for data from server
	category.training = [];
	category.testing = [];

	// Spliting data into training and test data
	for(let i = 0; i < totalDataObjects; i++) {
		let offset = i * len;
		if(i < trainingExamples) {
			category.training[i] = data[numInData].subarray(offset, offset + len);
			category.training[i].label = numInData;
		} else {
			category.testing[i - trainingExamples] = data[numInData].subarray(offset, offset + len);
			category.testing[i - trainingExamples].label = numInData;
		}
	}
}

// Setup function is not necessarily after preload, 
// setting timer to wait for data preparation to complete
setTimeout(function setup() {
	createCanvas(280, 280);
	background(0);

	// If timeout is too short for data to be received
	if(!dataReady) {
		console.log("Training data not received, try again!");
		return undefined;
	}

	// Creating one training data array
	let trainingArray = [];
	trainingArray = trainingArray.concat(airplains.training, apples.training, bicycles.training);

	console.log("Training...");
	// Main training loop! --------------------------------------------------
	for(let e = 0; e < epoch; e++) {

		// Shuffling training data with P5's shuffle
		shuffle(trainingArray, true);

		for(let i = 0; i < trainingArray.length; i++) {
			// Creating inputs array with one picture
			let inputs = [];
			for(let j = 0; j < trainingArray[i].length; j++) {
				inputs[j] = trainingArray[i][j] / 255.0;
			}

			// Creating targets array for training
			let label = trainingArray[i].label;
			let targets = [];
			for(let j = 0; j < dataClasses; j++) {
				targets[j] = 0;
			}
			targets[label] = 1;

			// Training --------------------------------------------------
			brain.train(inputs, targets);
			// Adjusting learning rate a little bit each time
			brain.setLearningRate(brain.getLearningRate() * learningRateMultiplicator);
		}
	}
	console.log("Network trained for " + epoch + " epoch/s! (" 
		+ (totalDataObjects * trainingRatio * dataClasses * epoch) + " times)");

	// Testing --------------------------------------------------
	let testingArray = [];
	testingArray = testingArray.concat(airplains.testing, apples.testing, bicycles.testing);

	// Feed forward 1000 times to test Networks accuracy
	let accuracy = 0;
	for(let i = 0; i < 1000; i++){
		// Random test subject by P5's random
		let test = random(testingArray);

		// Creating target array
		let target = [];
		for(let j = 0; j < dataClasses; j++) {
			target[j] = 0;
		}
		target[test.label] = 1;

		let res = brain.feedForward(test);
		let err = 0;
		for(let j = 0; j < dataClasses; j++) {
			err += target[j] - res[j];
		}
		if(err < epsilon) { accuracy++; }
	}
	console.log("Network's accuracy is " + (accuracy / 10) + "%");
}, 4000);

function draw() {

}