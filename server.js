// Neural Network Doodle Classifier

var express = require('express');
var socket = require('socket.io');
var fs = require('fs');
var nn = require('./NeuralNetwork.js');

var app = express();

var data = []; // Array with doodles

// Loading public directory
app.use(express.static('public'));

// -------------------------------------------------------------------------

const len = 784; // Length of one picture in data (28*28)
const totalDataObjects = 10000; // Number of images sent from server
const trainingRatio = 0.9; // Percent of data used as training data
const epsilon = 0.01; // Accepted error of Network's output
const dataClasses = 3;

const epoch = 2; // How many times train with full set of training examples
const learningRateMultiplicator = 1;

// Maping for classes
const AIRPLAIN = 0;
const APPLE = 1;
const BICYCLE = 2;

var socket; // Connection to server
var data; // All of the data from server
var brain; // NeuralNetwork Object // Maciek
var airplanes = {};
var apples = {};
var bicycles = {};

var trainingExamples = totalDataObjects * trainingRatio; // TrainingData examples
var dataReady; // Boolean flag

// Loading files
dataReady = false;

console.log("Loading files...");
data[0] = fs.readFileSync('./public/data/airplane10000.bin');
data[1] = fs.readFileSync('./public/data/apple10000.bin');
data[2] = fs.readFileSync('./public/data/bicycle10000.bin');
console.log("Files loaded!");

data[0] = new Uint8Array(data[0]);
data[1] = new Uint8Array(data[1]);
data[2] = new Uint8Array(data[2]);

prepareData(airplanes, data, AIRPLAIN);
prepareData(apples, data, APPLE);
prepareData(bicycles, data, BICYCLE);

dataReady = true;
console.log("Data ready!");

// Creating Neural Network
brain = new nn.NeuralNetwork(len, 64, dataClasses); // 784 inputs, 64 hidden and 2 outputs

function prepareData(category, data, numInData) { // numInData is a offset for data from server
	category.training = [];
	category.testing = [];

	// Spliting data into training and test data
	for(let i = 0; i < totalDataObjects; i++) {
		let offset = i * len;
		if(i < trainingExamples) {
			category.training[i] = data[numInData].subarray(offset, offset + len);
			category.training[i].label = numInData; // Class number
		} else {
			category.testing[i - trainingExamples] = data[numInData].subarray(offset, offset + len);
			category.testing[i - trainingExamples].label = numInData;
		}
	}
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Creating one training data array
let trainingArray = [];
trainingArray = trainingArray.concat(airplanes.training, apples.training, bicycles.training);

console.log("Training...");
// Main training loop! --------------------------------------------------
for(let e = 0; e < epoch; e++) {

	// Shuffling training data with P5's shuffle
	trainingArray = shuffle(trainingArray);

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
testingArray = testingArray.concat(airplanes.testing, apples.testing, bicycles.testing);

// Feed forward 1000 times to test Networks accuracy
let accuracy = 0;
for(let i = 0; i < 1000; i++){
	// Random test subject by P5's random
	var test = testingArray[Math.floor(Math.random()*testingArray.length)];

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


// Starting to listen for connections -------------------------------
var server = app.listen(3000);
var io = socket(server);

console.log("Server is running!");
console.log("Listening on port 3000...");

// New connection accured. Sending training data
io.sockets.on('connection', function(socket) {
	id = socket.id;
	console.log("New connection: " + id);
	io.sockets.connected[id].emit('welcome', id);

	socket.on('sendDraw', function(input) {
		// Feeding input sent by client to network
		let res = brain.feedForward(input);

		// Sending back result of FeedForward
		io.sockets.connected[id].emit('sendResult', res);
		console.log("Result sent: " + res);
	});
});
