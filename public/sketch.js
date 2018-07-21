var socket;
var msg;

function setup() {
	socket = io.connect('http://localhost:3000');
	socket.on('training_data', function(inData){
		msg = inData;
	});

	setTimeout(function() {
		console.table(msg);
	}, 4000);
}

function draw() {

}