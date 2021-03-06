# NeuralNetworkDoodleClassifierJS
## Neural Network classifing 28*28pix pictures drawn by user with p5.js 

### Data used for training and testing is from [Google Quick Draw](https://quickdraw.withgoogle.com/data).

You can also go [Here](https://quickdraw.withgoogle.com) to contribute to the database!
Your drawing is stored every time Google's AI guesses what you have drawn.

## To run this you have to install node.js, express and socket.io modules.
#### node_modules and data processing code is not yet included (files are too big).
#### Code is using .bin files that has been preprocessed in Processing. Processing sketch will be some day included.

## How it works:
### Neural network is training and testing itself with given .bin files when the server is starting.
### Included .bin training files have 10,000 pictures, it may take a while for network to finish training.
#### This may be changed to 1,000 pictures in each file by simply changing data loading file paths (in server.js) from, for example, /apple10000.bin to /apple1000.bin.
### When server's console says: "Listening on port 3000" server is ready to go (port is 3000 in default).
### On client side there is user interface where you can draw your own picture. After clicking "Guess" button drawing will be sent to server and Fed Forward through the net.Then the result will be sent back.
### Client side code prints the answer in HTML below the buttons.
### You can acces user interface by typing: http://localhost:3000/ or http://127.0.0.1:3000/
#### Also through your IP if you have internet connection: your_ip:3000 
### Drawings made by user in the browser should be as big as possible, so the network work as intended (its resizing the drawing to 28*28pix picture, that's preety small).

## Network can reckognize drawings of:
### Airplains
### Apples
### Bicycles

#### Network is trained on Google's Quick Draw database, so for example, picture detailed too much might not be reckognized.
#### For better effects first visit link in first paragraph and look at the pictures yourself.

### Feel free to clone and send pull requests, or contribute in any other way.
