const canvas = document.getElementById('canvas');
const scale = 20;
const fps = 20;

function Rect(context, x, y, color) {
	context.fillStyle = color;
	context.fillRect(x, y,
		scale, scale);
}


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	get top() {
		return this.y - scale;
	}

	get bottom() {
		return this.y + scale;
	}

	get right() {
		return this.x + scale;
	}

	get left() {
		return this.x - scale;
	}
}


class Snake {
	constructor() {
		this.pos = new Vector();
		this.velocity = new Vector();
		this.total = 0;
		this.tail = [];
	}

	show(context) {
		for (let i = 0; i < this.tail.length; i++) {
			Rect(context ,this.tail[i].x, this.tail[i].y, "blue");
		}
		Rect(context, this.pos.x, this.pos.y ,"green");
	}

	move() {
		if (this.total === this.tail.length) {
			for (let i = 0; i < this.tail.length - 1; i++) {
				this.tail[i] = this.tail[i + 1];
			}
		}
		if (this.total >= 1) {
			this.tail[this.total - 1] = new Vector(this.pos.x, this.pos.y);
		}

		this.pos.x += this.velocity.x * scale;
		this.pos.y += this.velocity.y * scale;
	}

	dir(x, y) {
		this.velocity.x = x;
		this.velocity.y = y;
	}

	eat(food) {
		if (Math.sqrt((food.pos.x - this.pos.x) * (food.pos.x - this.pos.x) +
				(food.pos.y - this.pos.y) * (food.pos.y - this.pos.y)) < 2) {
			this.total++;
			// this.tail.push(this.pos);
			return true;
		} else {
			return false;
		}
	}
}

class Food {
	constructor() {
		this.pos = new Vector();
	}

	pickLocation() {
		let cols = Math.floor(canvas.width / scale);
		let rows = Math.floor(canvas.height / scale);
		let randCol = getRandomInt(0, cols);
		let randRow = getRandomInt(0, rows);
		this.pos.x = randCol * scale;
		this.pos.y = randRow * scale;
	}

	show(context) {
		Rect(context, this.pos.x, this.pos.y, "red");
	}
}

class Game {
	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext('2d');
		this.snake = new Snake();
		this.food = new Food();
		this.food.pickLocation();
		// this.snake.velocity.x = 1;

		const callback = () => {
			this.update();
			setTimeout(callback, 1000 / fps);
		}

		callback();
	}

	draw(color) {
		this._context.fillStyle = color;
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		
	}

	update() {
		this.draw("black");

		if (this.snake.eat(this.food)) {
			this.food.pickLocation();
		}

		this.snake.move();
		this.snake.show(this._context);

		// boundaries
		if (this.snake.pos.right > this._canvas.width + scale) {
			this.snake.pos.x = 0;
		} else if (this.snake.pos.left < -scale) {
			this.snake.pos.x = this._canvas.width;
		} else if (this.snake.pos.bottom > this._canvas.height + scale) {
			this.snake.pos.y = 0;
		} else if (this.snake.pos.y < -scale) {
			this.snake.pos.y = this._canvas.height;
		}

		this.food.show(this._context);
	}
}

const game = new Game(canvas);

window.addEventListener('keydown', function(event) {
	if (event.key === "ArrowDown") {
		game.snake.dir(0, 1);
	} else if (event.key === "ArrowUp") {
		game.snake.dir(0, -1);
	} else if (event.key === "ArrowLeft") {
		game.snake.dir(-1, 0);
	} else if (event.key === "ArrowRight") {
		game.snake.dir(1, 0);
	}
}, true);