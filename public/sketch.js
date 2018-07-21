const len = 784;

var socket;
var result;

function setup() {
	createCanvas(280, 280);

	background(0);
	frameRate(150);

	// Connecting to server
	socket = io.connect('http://localhost:3000');

	// Sending drawn image to server by Guess button
	let guessButton = select('#guess');
	guessButton.mouseReleased(function() {
		let input = [];
		let img = get();
		img.resize(28, 28);

		img.loadPixels();
		for(let i = 0; i < len; i++) {
			let brightness = img.pixels[i * 4];
			input[i] = brightness / 255.0;
		}

		// Connecting to server
		socket = io.connect('http://localhost:3000');

		// Sending the drawing to server
		socket.on('welcome', function(id) {
			console.log("Data sent!");
			socket.emit('sendDraw', input);

		});

		socket.on('sendResult', function(res) {
			result = res;
			console.table(result);
			let idx = result.indexOf(max(result));
			if(idx === 0) {
				console.log("It's an airplane!");
				document.getElementById("answer").innerHTML = "It's an airplane!";
			} else if(idx === 1) {
				console.log("It's an apple!");
				document.getElementById("answer").innerHTML = "It's an apple!";
			} else if(idx === 2) {
				console.log("It's a bicycle!");
				document.getElementById("answer").innerHTML = "It's a bicycle!";
			}
		});
	});

	// Instead Of refreshing the page
	let clearButton = select("#reset");
	clearButton.mouseReleased(function() {
		background(0);
		document.getElementById("answer").innerHTML = "";
	});
}

function draw() {
	// Drawn line width, may be important in picture classification. Don't know the best one, yet
	strokeWeight(3);
	stroke(255);
	if(mouseIsPressed) {
		line(pmouseX, pmouseY, mouseX, mouseY);
	}
}