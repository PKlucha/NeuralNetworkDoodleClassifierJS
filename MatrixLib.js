class Matrix {
	constructor(rows, cols){
		this.rows = rows;
		this.cols = cols;
		this.data = [];

		for(var i = 0; i < this.rows; i++) {
			this.data[i] = [];
			for(var j = 0; j < this.cols; j++) {
				this.data[i][j] = 0;
			}
		}
	}
 
	randomize() {
		for(var i = 0; i < this.rows; i++) {
			for(var j = 0; j < this.cols; j++) {
				this.data[i][j] = Math.random() * 2 - 1;
			}	
		}
	}
	multiply(n) {
		if(n instanceof Matrix){
			if(this.rows === n.rows && this.cols === n.cols) {
				for(var i = 0; i < this.rows; i++) {
					for(var j = 0; j < this.cols; j++) {
						this.data[i][j] *= n.data[i][j];
					}	
				}
			} else {console.log("Matrixes dimensions must be equal! (Matrix.multiply())")}
		} else {
			for(var i = 0; i < this.rows; i++) {
				for(var j = 0; j < this.cols; j++) {
					this.data[i][j] *= n;
				}	
			}
		}
	}
	static multiply(a, b) {
		if(a instanceof Matrix && b instanceof Matrix){
			if(a.cols != b.rows){
				console.log("Inappropriate Matrixes dimesions(Matrix.dotProduct())");
				return undefined;
			}
			let result = new Matrix(a.rows, b.cols);
			for(let i = 0; i < result.rows; i++){
				for(let j = 0; j < result.cols; j++){
					let sum = 0;
					for(let k = 0; k < a.cols; k++){
						sum += a.data[i][k] * b.data[k][j];
					}
					result.data[i][j] = sum;
				}
			}
			return result;
		} else {
			console.log("Paramiters must be Matrixes (Matrix.dotProduct())");
		}
	}
	add(n) {
		if(n instanceof Matrix){
			if(this.rows === n.rows && this.cols === n.cols) {

				for(var i = 0; i < this.rows; i++) {
					for(var j = 0; j < this.cols; j++) {
						this.data[i][j] += n.data[i][j];
					}	
				}

			} else {console.log("Matrixes dimensions must be equal! (Matrix.add())") }
		} else {

			for(var i = 0; i < this.rows; i++) {
				for(var j = 0; j < this.cols; j++) {
					this.data[i][j] += n;
				}	
			}
		}
	}
	static subtract(a, b) {
		if(a instanceof Matrix && b instanceof Matrix) {
			if(a.cols === b.cols && a.rows === b.rows) {

				let result = new Matrix(a.rows, a.cols);
				for(var i = 0; i < a.rows; i++) {
					for(var j = 0; j < a.cols; j++) {
						result.data[i][j] = a.data[i][j] - b.data[i][j];
					}
				}
				return result;

			} else {console.log("Matrixes dimensions must be equal! (Matrix.add())") }
		} else {
			console.log("Both paramiters must be Matrix objects (Matrix.subtract)");
			return undefined;
		}
	}
	map(fun) { // Applies function to every single element in data matrix
		for(var i = 0; i < this.rows; i++) {
			for(var j = 0; j < this.cols; j++) {
				let val = this.data[i][j];
				this.data[i][j] = fun(val);
			}	
		}
	}
	static map(matrix, fun) { // Applies function to every single element in data matrix
		let result = new Matrix(matrix.rows, matrix.cols);
		for(var i = 0; i < result.rows; i++) {
			for(var j = 0; j < result.cols; j++) {
				let val = matrix.data[i][j];
				result.data[i][j] = fun(val);
			}	
		}
		return result;
	}
	print() {
		console.table(this.data);
	}
	static transpose(a) {
		let result = new Matrix(a.cols, a.rows);
		for(var i = 0; i < a.rows; i++) {
			for(var j = 0; j < a.cols; j++) {
				result.data[j][i] = a.data[i][j]; 
			}
		}	
		return result;
	}
	static fromArray(array) {
		let m = new Matrix(array.length, 1);
		for(let i = 0; i < array.length; i++){
			m.data[i][0] = array[i];
		}
		return m;
	}
	toArray() {
		let array = [];
		for(let i = 0; i < this.rows; i++) {
			for(let j = 0; j < this.cols; j++){
				array.push(this.data[i][j]);
			}
		}
		return array;
	}
}

module.exports.Matrix = Matrix;