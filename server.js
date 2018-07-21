// node.js server for Neural Network Doodle Classifier

var express = require('express');
var socket = require('socket.io');
var fs = require('fs');

var app = express();

var data = []; // Array with doodles

// Loading public directory
app.use(express.static('public'));

// Loading files
console.log("Loading files...");
data[0] = fs.readFileSync('./public/data/airplane1000.bin');
data[1] = fs.readFileSync('./public/data/apple1000.bin');
data[2] = fs.readFileSync('./public/data/bicycle1000.bin');
console.log("Files loaded!");

var server = app.listen(3000);
var io = socket(server);

// New connection accured. Sending training data
io.sockets.on('connection', function(socket) {
	io.sockets.connected[socket.id].emit("training_data", data);
	console.log("New connection: " + socket.id + ", training data has been sent!");
});

console.log("Server is running!");
console.log("Listening on port 3000...");