# NeuralNetworkDoodleClassifierJS
## Neural Network classifing 28*28pix pictures drawn by user with p5.js 

### Data used in this case is from [Google Quick Draw](https://quickdraw.withgoogle.com/data).

You can also go [Here](https://quickdraw.withgoogle.com) to contribute to the database!
Your drawing is stored every time Google's AI guesses what you have drawn.

## To run this you have to install node.js, express and socket.io modules.
#### node_modules and data processing code is not yet included (files are too big).
#### Code is using .bin files that has been preprocessed in Processing. Processing sketch will be some day included.

## How it works:
### Neural network is training and testing itself with given .bin files when the server is starting.
### On client side, there is user interface, where you can draw your own picture. After clicking "Guess" button drawing will be sent to server and Fed Forvard through the net and the result will be sent back.
### Client side code prints the answer in HTML below the buttons.
### Drawings in the browser should be as big as possible, yet inside the drawing canvas; so the network work as intended.
